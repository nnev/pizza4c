import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import React, {ChangeEvent, MouseEvent} from "react";
import {CustomizeOptionGroup} from "./CustomizeOptionGroup.tsx";
import {PixmapButton, PixmapGroup, PixmapLink} from "../Pixmap.tsx";
import {Navigate, useParams} from "react-router-dom";
import {addToCart} from "../../backend/Cart.ts";
import FormattedError from "../../datamodel/error.ts";
import {Error} from "../Error.tsx";
import {getFavorites, setFavorites} from "../../datamodel/favorites.ts";
import CartEntry from "../../datamodel/cart/cartEntry.ts";
import {mapToDictionary} from "../../util/Dictionary.ts";
import {MenuItem, Variation} from "../../datamodel/restaurant/menu.ts";
import {formatAsEuro} from "../../util/Formatter.ts";

interface CustomizeVariantProps {
    productId: string;
    variantId: string;
}

interface CustomizeVariantState {
    selectedOptions: Map<string, Set<string>>;
    restaurant?: Restaurant;
    menuItem?: MenuItem;
    variation?: Variation;
    addToCartCompleted: boolean
    error?: FormattedError
    comment?: string
    alreadyFavorited: boolean
}

class CustomizeVariantClazz extends React.Component<CustomizeVariantProps, CustomizeVariantState> {
    constructor(props: CustomizeVariantProps, context: any) {
        super(props, context);
        this.state = {
            selectedOptions: new Map<string, Set<string>>(),
            addToCartCompleted: false,
            alreadyFavorited: false
        };
    }

    listener = (value: Restaurant) => {
        let menuItem = value.menu.menuItems[this.props.productId];
        let variation = menuItem.variations[this.props.variantId];
        this.setState({
            restaurant: value,
            menuItem: menuItem,
            variation: variation,
        });
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    addToCart = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.props.productId && this.props.variantId && this.getCustomizationCompleted()) {
            addToCart(this.props.productId, this.props.variantId, this.state.selectedOptions, this.state.comment)
                .then(_ => {
                    this.setState({addToCartCompleted: true});
                })
                .catch(value => {
                    this.setState({error: value as FormattedError})
                })
        }
    }
    addToFavorites = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.props.productId && this.props.variantId && this.getCustomizationCompleted()) {
            let favorites = getFavorites();
            favorites.favorite.push(new CartEntry(
                "",
                this.props.productId,
                this.props.variantId,
                mapToDictionary(this.state.selectedOptions),
                this.state.comment
            ))
            setFavorites(favorites, true);
            this.setState({alreadyFavorited: true});
        }
    }

    private getCustomizationCompleted(): boolean {
        let variation = this.state.variation;
        let selectedOptionsGroups = this.state.selectedOptions;
        if (variation == undefined) {
            return false;
        } else {
            for (const optionGroupId of Object.keys(variation.modifierGroups)) {
                let optionGroup = variation.modifierGroups[optionGroupId];
                let selectedOptions = selectedOptionsGroups == undefined ? new Set<string> : selectedOptionsGroups!.get(optionGroupId);
                let numSelected = selectedOptions ? selectedOptions.size : 0;
                if (numSelected < optionGroup.minAmount || numSelected > optionGroup.maxAmount) {
                    return false;
                }
            }
        }

        return true;
    }

    private getTotalPriceCents(): number {
        let total = 0;
        if (this.state.menuItem && this.state.variation) {
            total += this.state.variation.priceCents;
            for (let modifierGroupId of this.state.selectedOptions.keys()) {
                let modifierGroup = this.state.variation.modifierGroups[modifierGroupId];
                let modifiers = this.state.selectedOptions.get(modifierGroupId);
                if (modifiers != undefined) {
                    modifiers.forEach((modifierId) => {
                        let modifier = modifierGroup.modifiers[modifierId];
                        total += modifier.priceCents;
                    })
                }
            }
        }
        return total;
    }

    changeComment = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        let value = ev.target.value;
        this.setState({
            comment: value,
            alreadyFavorited: false
        })
    }

    private getDescription() {
        return <ol>
            <li>{this.state.menuItem!!.description}</li>
        </ol>
    }


    render() {
        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>;
        }
        if (this.state.restaurant == undefined || this.state.menuItem == undefined || this.state.variation == undefined) {
            return <></>;
        }

        let completed = this.getCustomizationCompleted();
        let alreadyFavorited = this.state.alreadyFavorited;

        return (
            <main className="notSide customize">
                <h1>{this.state.menuItem.name} {this.state.variation ? this.state.variation!.name : ""}</h1>
                {this.getDescription()}
                <span
                    className="total">Preis ohne Extras: <span>{formatAsEuro(this.state.variation!.priceCents)}</span></span><br/>

                <div className="variantContent">
                    <ul>
                        {
                            Object.entries(this.state.variation!.modifierGroups).map(([modifierGroupId, modifierGroup]) =>
                                <CustomizeOptionGroup
                                    key={modifierGroupId}
                                    modifierGroupId={modifierGroupId}
                                    modifierGroup={modifierGroup}
                                    onModifierSelected={this.selectOption}
                                />
                            )
                        }
                    </ul>
                </div>

                <div>
                    <label htmlFor="comment">Extrawünsche:</label> <br/>
                    <textarea
                        name="comment"
                        id="comment"
                        cols={40}
                        rows={10}
                        value={this.state.comment}
                        onChange={this.changeComment}
                    />
                </div>

                <span className="total"> <b>Total</b>: {formatAsEuro(this.getTotalPriceCents())}</span> <br/>
                {this.state.error && <Error text={this.state.error.message}/>}
                <PixmapGroup>
                    <PixmapLink to="/order" pixmap="arrow_back" text="Zurück zur Produktauswahl"/>
                    {Object.keys(this.state.menuItem.variations).length != 1 &&
                        <PixmapLink to={"/customize/" + this.props.productId} pixmap="arrow_back"
                                    text="Zurück zur Größenauswahl"/>
                    }

                    <PixmapButton
                        onClick={this.addToFavorites}
                        pixmap="favorite_border"
                        text={completed ? "Zu Favoriten hinzufügen" : "Noch nicht alle benötigten Optionen ausgewählt!"}
                        disabled={!completed || alreadyFavorited}
                        className="primary right"
                    />
                    <PixmapButton
                        onClick={this.addToCart}
                        pixmap="add"
                        text={completed ? "Zur Bestellung hinzufügen" : "Noch nicht alle benötigten Optionen ausgewählt!"}
                        disabled={!completed}
                        className="primary right"
                    />
                </PixmapGroup>
            </main>
        );
    }

    selectOption = (optionGroupId: string, selectedOptions: Set<string>) => {
        let selectedOptionsSet = this.state.selectedOptions;
        selectedOptionsSet.set(optionGroupId, selectedOptions)
        this.setState({selectedOptions: selectedOptionsSet, alreadyFavorited: false})
    };
}

export const CustomizeVariant = () => {
    let props = useParams();
    return <CustomizeVariantClazz
        productId={props.productId || "määh"}
        variantId={props.variantId || "mäh"}
    />
}