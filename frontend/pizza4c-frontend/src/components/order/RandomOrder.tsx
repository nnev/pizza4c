import React, {MouseEvent} from "react";
import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import Dictionary, {chooseRandomDict, mapToDictionary} from "../../util/Dictionary.ts";
import CartEntry from "../../datamodel/cart/cartEntry.ts";
import {OptionListView} from "../overview/OptionListView.tsx";
import {PixmapButton, PixmapGroup, PixmapLink} from "../Pixmap.tsx";
import FormattedError from "../../datamodel/error.ts";
import {addToCart} from "../../backend/Cart.ts";
import {Navigate} from "react-router-dom";
import {FormatPrice} from "../overview/FormatPrice.tsx";
import {ModifierGroup, Variation} from "../../datamodel/restaurant/menu.ts";

interface RandomOrderProps {
}

interface RandomOrderState {
    restaurant?: Restaurant

    selectedMenuItemId?: string
    selectedVariationId?: string
    selectedModifiers?: Map<string, Set<string>>
    numModifiers: number
    addToCartCompleted: boolean
    error?: FormattedError
}

export class RandomOrder extends React.Component<RandomOrderProps, RandomOrderState> {
    constructor(props: RandomOrderProps, context: any) {
        super(props, context);
        this.state = {
            numModifiers: 1,
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
        let _menuItem = chooseRandomDict(this.state.restaurant.menu.menuItems);
        console.log("Product", _menuItem);
        if (_menuItem == undefined) {
            return;
        }
        let [menuItemId, menuItem] = _menuItem;

        let _variantion = chooseRandomDict(menuItem.variations);
        console.log("variant", _variantion);
        if (_variantion == undefined) {
            return;
        }
        let [variationId, variantion] = _variantion;

        let [minAddons, maxAddons] = this.getMinMaxOptions(variantion);

        console.log("Available option groups", variantion.modifierGroups);
        let numOptions = Math.max(0, Math.max(minAddons, Math.min(this.state.numModifiers, maxAddons)));
        this.setState({
            selectedMenuItemId: menuItemId,
            selectedVariationId: variationId,
            numModifiers: numOptions,
            selectedModifiers: this.selectOptions(variantion.modifierGroups, numOptions)
        })
    }

    private randomizeAddons() {
        if (this.state.restaurant == undefined || this.state.selectedMenuItemId == undefined || this.state.selectedVariationId == undefined) {
            return;
        }
        let menuItem = this.state.restaurant.menu.menuItems[this.state.selectedMenuItemId];
        let variation = menuItem.variations[this.state.selectedVariationId];
        if (variation == undefined) {
            return;
        }
        this.setState({
            selectedModifiers: this.selectOptions(variation.modifierGroups, this.state.numModifiers)
        })
    }

    private selectOptions(modifierGroups: Dictionary<ModifierGroup>, numOptions: number): Map<string, Set<string>> {
        if (this.state.restaurant == null) {
            throw "";
        }
        let result = new Map<string, Set<string>>();

        let numInitialOptions = 0
        for (let modifierGroupId of Object.keys(modifierGroups)) {
            let modifierGroup = modifierGroups[modifierGroupId]
            if (modifierGroup.minAmount > 0) {
                for (let i = 0; i < modifierGroup.minAmount; i++) {
                    let _modifier = chooseRandomDict(modifierGroup.modifiers)
                    console.log("Modifier", _modifier);
                    if (_modifier == undefined) {
                        continue;
                    }

                    let [modifierId, _] = _modifier;

                    if (this.addToOptionSet(result, modifierGroupId, modifierGroup, modifierId)) {
                        numInitialOptions++;
                    }
                }
            }
        }

        let numAddedOptions = 0;
        if (numInitialOptions < numOptions) {
            for (let i = 0; i < 100; i++) {
                let _modifierGroup = chooseRandomDict(modifierGroups);
                console.log("Modifier Group", _modifierGroup);
                if (_modifierGroup == undefined) {
                    continue;
                }

                let [modifierGroupId, modifierGroup] = _modifierGroup;

                let _modifierId = chooseRandomDict(modifierGroup.modifiers)
                console.log(_modifierId);
                if (_modifierId == undefined) {
                    continue;
                }

                let [modifierId, _] = _modifierId;

                if (this.addToOptionSet(result, modifierGroupId, modifierGroup, modifierId)) {
                    console.log("********", modifierGroupId, modifierGroup, modifierId)
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

    private addToOptionSet(result: Map<string, Set<string>>, modifierGroupId: string, modifierGroup: ModifierGroup, modifierId: string): boolean {
        let _modifiers = result.get(modifierGroupId);
        if (_modifiers == undefined) {
            _modifiers = new Set<string>();
            result.set(modifierGroupId, _modifiers);
        }
        if (_modifiers.size < modifierGroup.maxAmount) {
            let exists = _modifiers.has(modifierId);
            _modifiers.add(modifierId);
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
        if (this.state.selectedMenuItemId == undefined || this.state.selectedVariationId == undefined || this.state.selectedModifiers == undefined) {
            return
        }
        addToCart(this.state.selectedMenuItemId, this.state.selectedVariationId, this.state.selectedModifiers, "")
            .then(_ => {
                this.setState({addToCartCompleted: true});
            })
            .catch(value => {
                this.setState({error: value as FormattedError})
            })
    }

    lessAddons = () => {
        this.setState({numModifiers: Math.max(0, this.state.numModifiers - 1)}, () => {
            this.randomizeAddons()
        })
    }
    moreAddons = () => {
        this.setState({numModifiers: Math.min(5, this.state.numModifiers + 1)}, () => {
            this.randomizeAddons()
        })
    }

    private getMinMaxOptions(variant: Variation): [number, number] {
        let minAddons = Object.values(variant.modifierGroups).map(it => it.minAmount).reduce((a, b) => a + b, 0)
        let maxAddons = Object.values(variant.modifierGroups).map(it => it.maxAmount).reduce((a, b) => a + b, 0)
        maxAddons = Math.min(maxAddons, minAddons + 5);
        return [minAddons, maxAddons];
    }

    render() {
        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>;
        }
        if (this.state.selectedMenuItemId == undefined ||
            this.state.selectedVariationId == undefined ||
            this.state.selectedModifiers == undefined ||
            this.state.restaurant == undefined
        ) {
            return <></>
        }
        let cartEntry = new CartEntry(
            "",
            this.state.selectedMenuItemId,
            this.state.selectedVariationId,
            mapToDictionary(this.state.selectedModifiers)
        )

        let menuItem = this.state.restaurant.menu.menuItems[this.state.selectedMenuItemId];
        let variation = menuItem.variations[this.state.selectedVariationId];
        if (variation == undefined) {
            return;
        }

        let [minAddons, maxAddons] = this.getMinMaxOptions(variation);

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
                        disabled={this.state.numModifiers <= minAddons}
                    />
                    <span><b>{this.state.numModifiers == 0 ? "Keine Addons" : "Bis zu " + this.state.numModifiers + " Addons"}</b></span>
                    <PixmapButton
                        onClick={() => this.moreAddons()}
                        pixmap="arrow_forward"
                        text="Mehr Addons"
                        disabled={this.state.numModifiers >= maxAddons}
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
