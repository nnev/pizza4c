import React, {MouseEvent} from "react";
import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import {chooseRandomArray, chooseRandomDict, mapToDictionary} from "../../util/Dictionary.ts";
import CartEntry from "../../datamodel/cart/cartEntry.ts";
import {OptionListView} from "../overview/OptionListView.tsx";
import {PixmapButton, PixmapGroup, PixmapLink} from "../Pixmap.tsx";
import FormattedError from "../../datamodel/error.ts";
import {addToCart} from "../../backend/Cart.ts";
import {Navigate} from "react-router-dom";
import {FormatPrice} from "../overview/FormatPrice.tsx";
import {OptionGroup} from "../../datamodel/restaurant/optionGroup.ts";
import Variant from "../../datamodel/restaurant/variant.ts";

interface RandomOrderProps {
}

interface RandomOrderState {
    restaurant?: Restaurant

    selectedProductId?: string
    selectedVariantId?: string
    selectedOptions?: Map<string, Set<string>>
    numOptions: number
    addToCartCompleted: boolean
    error?: FormattedError
}

export class RandomOrder extends React.Component<RandomOrderProps, RandomOrderState> {
    constructor(props: RandomOrderProps, context: any) {
        super(props, context);
        this.state = {
            numOptions: 1,
            addToCartCompleted: false,
        }
    }

    listener = (value: Restaurant) => {
        this.setState({restaurant: value}, () => {
            this.randomize()
        })
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    private randomize() {
        console.log("Restaurant", this.state.restaurant);
        if (this.state.restaurant == undefined) {
            return
        }
        let _product = chooseRandomDict(this.state.restaurant.menu.products);
        console.log("Product", _product);
        if (_product == undefined) {
            return;
        }
        let [productId, product] = _product

        let variant = chooseRandomArray(product.variants);
        console.log("variant", variant);
        if (variant == undefined) {
            return;
        }

        let [minAddons, maxAddons] = this.getMinMaxOptions(variant);

        console.log("Available option groups", variant.optionGroupIds);
        let numOptions = Math.max(0, Math.max(minAddons, Math.min(this.state.numOptions, maxAddons)));
        this.setState({
            selectedProductId: productId,
            selectedVariantId: variant.id,
            numOptions: numOptions,
            selectedOptions: this.selectOptions(variant.optionGroupIds, numOptions)
        })
    }

    private randomizeAddons() {
        if (this.state.restaurant == undefined || this.state.selectedProductId == undefined) {
            return;
        }
        let product = this.state.restaurant.menu.products[this.state.selectedProductId];
        let variant = product.variants.find(v => v.id == this.state.selectedVariantId)
        if (variant == undefined) {
            return;
        }
        this.setState({
            selectedOptions: this.selectOptions(variant.optionGroupIds, this.state.numOptions)
        })
    }

    private selectOptions(optionGroupIds: string[], numOptions: number): Map<string, Set<string>> {
        if (this.state.restaurant == null) {
            throw "";
        }
        let result = new Map<string, Set<string>>();

        let numInitialOptions = 0
        for (let optionGroupId of optionGroupIds) {
            let optionGroup = this.state.restaurant.menu.optionGroups[optionGroupId]
            if (optionGroup.minChoices > 0) {
                for (let i = 0; i < optionGroup.minChoices; i++) {
                    let optionId = chooseRandomArray(optionGroup.optionIds)
                    console.log(optionId);
                    if (optionId == undefined) {
                        continue;
                    }

                    if (this.addToOptionSet(result, optionGroupId, optionGroup, optionId)) {
                        numInitialOptions++;
                    }
                }
            }
        }

        let numAddedOptions = 0;
        if (numInitialOptions < numOptions) {
            for (let i = 0; i < 100; i++) {
                let optionGroupId = chooseRandomArray(optionGroupIds);
                console.log("Option Group", optionGroupId);
                if (optionGroupId == undefined) {
                    continue;
                }

                let optionGroup = this.state.restaurant.menu.optionGroups[optionGroupId];
                console.log(optionGroup);
                let optionId = chooseRandomArray(optionGroup.optionIds)
                console.log(optionId);
                if (optionId == undefined) {
                    continue;
                }

                if (this.addToOptionSet(result, optionGroupId, optionGroup, optionId)) {
                    console.log("********", optionGroupId, optionGroup, optionId)
                    numAddedOptions++;
                }

                console.log("#######", numInitialOptions, numAddedOptions, numOptions, result);

                if ((numAddedOptions + numInitialOptions) >= numOptions) {
                    break;
                }
            }
        }
        return result;
    }

    private addToOptionSet(result: Map<string, Set<string>>, optionGroupId: string, optionGroup: OptionGroup, optionId: string): boolean {
        let optionSet = result.get(optionGroupId);
        if (optionSet == undefined) {
            optionSet = new Set<string>();
            result.set(optionGroupId, optionSet);
        }
        if (optionSet.size < optionGroup.maxChoices) {
            let exists = optionSet.has(optionId);
            optionSet.add(optionId);
            return !exists;
        }
        return false;
    }

    reroll = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        this.randomize();
    }
    submit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.state.selectedProductId == undefined || this.state.selectedVariantId == undefined || this.state.selectedOptions == undefined) {
            return
        }
        addToCart(this.state.selectedProductId, this.state.selectedVariantId, this.state.selectedOptions, "")
            .then(_ => {
                this.setState({addToCartCompleted: true});
            })
            .catch(value => {
                this.setState({error: value as FormattedError})
            })
    }

    lessAddons = () => {
        this.setState({numOptions: Math.max(0, this.state.numOptions - 1)}, () => {
            this.randomizeAddons()
        })
    }
    moreAddons = () => {
        this.setState({numOptions: Math.min(5, this.state.numOptions + 1)}, () => {
            this.randomizeAddons()
        })
    }

    private getMinMaxOptions(variant: Variant): [number, number] {
        let minAddons = variant.optionGroupIds.map(it => this.state.restaurant!!.menu.optionGroups[it].minChoices).reduce((a, b) => a + b, 0)
        let maxAddons = variant.optionGroupIds.map(it => this.state.restaurant!!.menu.optionGroups[it].maxChoices).reduce((a, b) => a + b, 0)
        maxAddons = Math.min(maxAddons, minAddons + 5);
        return [minAddons, maxAddons];
    }

    render() {
        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>;
        }
        if (this.state.selectedProductId == undefined ||
            this.state.selectedVariantId == undefined ||
            this.state.selectedOptions == undefined ||
            this.state.restaurant == undefined
        ) {
            return <></>
        }
        let cartEntry = new CartEntry(
            "",
            this.state.selectedProductId,
            this.state.selectedVariantId,
            mapToDictionary(this.state.selectedOptions)
        )

        let product = this.state.restaurant.menu.products[this.state.selectedProductId];
        let variant = product.variants.find(v => v.id == this.state.selectedVariantId)
        if (variant == undefined) {
            return;
        }

        let [minAddons, maxAddons] = this.getMinMaxOptions(variant);

        return <main className="notSide">
            <h1>Deine Zufällige Bestellung</h1>

            <OptionListView
                entry={cartEntry}
                restaurant={this.state.restaurant}
                withSize={true}
                withDescription={true}
            />
            <br/>
            <br/>

            <b>Preis: <FormatPrice price={cartEntry.getPrice(this.state.restaurant.menu)}/></b>
            <br/>

            {maxAddons > 0 && <>
                <PixmapGroup>
                    <PixmapButton
                        onClick={() => this.lessAddons()}
                        pixmap="arrow_back"
                        text="Weniger Addons"
                        disabled={this.state.numOptions <= minAddons}
                    />
                    <span><b>{this.state.numOptions == 0 ? "Keine Addons" : "Bis zu " + this.state.numOptions + " Addons"}</b></span>
                    <PixmapButton
                        onClick={() => this.moreAddons()}
                        pixmap="arrow_forward"
                        text="Mehr Addons"
                        disabled={this.state.numOptions >= maxAddons}
                    />
                    <PixmapButton
                        onClick={() => this.randomizeAddons()}
                        pixmap="casino"
                        text="Addons neu würfeln"
                        className="right"
                    />
                </PixmapGroup>
                <br/>
            </>
            }
            <PixmapGroup>
                <PixmapLink
                    to="/order"
                    pixmap="arrow_back"
                    text="Zurück zur Größenauswahl"
                />
                <PixmapButton
                    onClick={this.reroll}
                    pixmap="casino"
                    text="Neu würfeln"
                    className="primary right"
                />
                <PixmapButton onClick={this.submit} pixmap="save" text="In den Warenkorb legen"
                              className="primary right"/>
            </PixmapGroup>
        </main>
    }
}
