import React, {MouseEvent} from "react";
import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import {chooseRandomArray, chooseRandomDict, mapToDictionary} from "../../util/Dictionary.ts";
import CartEntry from "../../datamodel/cart/cartEntry.ts";
import {OptionListView} from "../overview/OptionListView.tsx";
import {PixmapButton, PixmapGroup} from "../Pixmap.tsx";
import FormattedError from "../../datamodel/error.ts";
import {addToCart} from "../../backend/Cart.ts";
import {Navigate} from "react-router-dom";
import {FormatPrice} from "../overview/FormatPrice.tsx";

interface RandomOrderProps {
}

interface RandomOrderState {
    restaurant?: Restaurant

    selectedProductId?: string
    selectedVariantId?: string
    selectedOptions?: Map<string, Set<string>>
    numOptions: number
    addToCartCompleted: boolean
    backToOrder: boolean
    error?: FormattedError
}

export class RandomOrder extends React.Component<RandomOrderProps, RandomOrderState> {
    constructor(props: RandomOrderProps, context: any) {
        super(props, context);
        this.state = {
            numOptions: 1,
            addToCartCompleted: false,
            backToOrder: false
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

        console.log("Available option groups", variant.optionGroupIds);
        this.setState({
            selectedProductId: productId,
            selectedVariantId: variant.id,

            selectedOptions: this.selectOptions(variant.optionGroupIds, this.state.numOptions)
        })
    }

    private selectOptions(optionGroupIds: string[], numOptions: number): Map<string, Set<string>> {
        if (this.state.restaurant == null) {
            throw "";
        }
        let result = new Map<string, Set<string>>();
        for (let i = 0; i < numOptions; i++) {
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

            let optionSet = result.get(optionGroupId);
            if (optionSet == undefined) {
                optionSet = new Set<string>();
                result.set(optionGroupId, optionSet);
            }

            if (optionSet.size < optionGroup.maxChoices) {
                optionSet.add(optionId);
            }
        }
        return result;
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
    backToOrder = () => {
        this.setState({backToOrder: true});
    }

    lessAddons = () => {
        this.setState({numOptions: Math.max(0, this.state.numOptions - 1)}, () => {
            this.randomize()
        })
    }
    moreAddons = () => {
        this.setState({numOptions: Math.min(5, this.state.numOptions + 1)}, () => {
            this.randomize()
        })
    }

    render() {
        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>;
        }
        if (this.state.backToOrder) {
            return <Navigate to={"/order"}/>;
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
        return <main className="notSide">
            <h1>Deine Zufällige Bestellung</h1>

            <OptionListView
                entry={cartEntry}
                restaurant={this.state.restaurant}
                withSize={true}
            />
            <br/>

            Preis: <FormatPrice price={cartEntry.getPrice(this.state.restaurant.menu)}/>
            <br/>

            <PixmapGroup>
                <PixmapButton
                    onClick={this.lessAddons}
                    pixmap="arrow_back"
                    text="Weniger Addons"
                    disabled={this.state.numOptions <= 0}
                />
                <span><b>Bis zu {this.state.numOptions} Addons</b></span>
                <PixmapButton
                    onClick={this.moreAddons}
                    pixmap="arrow_forward"
                    text="Mehr Addons"
                    disabled={this.state.numOptions >= 5}
                />
                <PixmapButton onClick={this.reroll} pixmap="casino" text="Neu würfeln" className="primary right"/>
            </PixmapGroup>
            <br/>
            <PixmapGroup>
                <PixmapButton onClick={this.backToOrder} pixmap="arrow_back"
                              text="Zurück zur Größenauswahl"/>
                <PixmapButton onClick={this.submit} pixmap="save" text="In den Warenkorb legen"
                              className="primary right"/>
            </PixmapGroup>
        </main>
    }
}
