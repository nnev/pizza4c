import React, {MouseEvent} from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {getFavorites, setFavorites} from "../../datamodel/favorites.ts";
import {OptionListView} from "../overview/OptionListView.tsx";
import {PixmapButton, PixmapGroup} from "../Pixmap.tsx";
import CartEntry from "../../datamodel/cart/cartEntry.ts";
import FormattedError from "../../datamodel/error.ts";
import {Navigate} from "react-router-dom";
import {Error} from "../Error.tsx";
import {addToCart, AllCartsObservable} from "../../backend/Cart.ts";
import {dictionaryToMap} from "../../util/Dictionary.ts";

interface FavoritesEntryProps {
    entry: CartEntry
    restaurant: Restaurant
}

interface FavoritesEntryState {
    addToCartCompleted: boolean
    error?: FormattedError
}

export class FavoritesEntry extends React.Component<FavoritesEntryProps, FavoritesEntryState> {
    constructor(props: FavoritesEntryProps, context: any) {
        super(props, context);
        this.state = {
            addToCartCompleted: false,
        }
    }

    addToCart = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault()
        if (this.props.entry.product && this.props.entry.variant) {
            addToCart(
                this.props.entry.product,
                this.props.entry.variant,
                dictionaryToMap(this.props.entry.options),
                this.props.entry.comment
            )
                .then(_ => {
                    this.setState({addToCartCompleted: true});
                })
                .catch(value => {
                    this.setState({error: value as FormattedError})
                })
        }
    }

    removeFromFavorites = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.props.entry.product && this.props.entry.variant) {
            if (window.confirm("Wirklich löschen?")) {
                let favorites = getFavorites();
                favorites.favorite = favorites.favorite.filter(f => f != this.props.entry)
                setFavorites(favorites, true);
            }
        }
    }

    render() {
        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>;
        }
        return (
            <div className="favoriteEntry">
                {this.state.error && <Error text={this.state.error.message}/>}

                <OptionListView
                    entry={this.props.entry}
                    restaurant={this.props.restaurant}
                    withSize={true}
                />
                <span
                    className="total"> <b>Total</b>: {this.props.entry.getPrice(this.props.restaurant.menu).toFixed(2)}€</span>
                <br/>

                <PixmapGroup>
                    <PixmapButton
                        onClick={this.addToCart}
                        pixmap="add"
                        text={"Zur Bestellung hinzufügen"}
                        className="primary"
                        disabled={AllCartsObservable.getValue().isSubmitted()}
                    />
                    <PixmapButton
                        onClick={this.removeFromFavorites}
                        pixmap="remove"
                        text={"Favorit entfernen"}
                    />
                </PixmapGroup>
            </div>
        )
    }
}