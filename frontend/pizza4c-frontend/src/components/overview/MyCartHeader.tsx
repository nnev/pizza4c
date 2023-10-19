import Cart from "../../datamodel/cart/cart.ts";
import React, {MouseEvent} from "react";
import {ToggleCartPaid} from "./ToggleCartPaid.tsx";
import {PixmapButton, PixmapGroup} from "../Pixmap.tsx";
import {AllCartsObservable} from "../../backend/Cart.ts";
import {Navigate} from "react-router-dom";
import {Favorites, FavoritesObservable} from "../../datamodel/favorites.ts";

interface MyCartHeaderProps {
    cart?: Cart;
    name: string
}

interface MyCartHeaderState {
    redirectOrder: boolean;
    redirectLogout: boolean;
    redirectFavorites: boolean;
    favorites?: Favorites;
}


export class MyCartHeader extends React.Component<MyCartHeaderProps, MyCartHeaderState> {

    constructor(props: MyCartHeaderProps, context: any) {
        super(props, context);
        this.state = {redirectLogout: false, redirectOrder: false, redirectFavorites: false}
    }

    favoritesObserver = (favorites: Favorites) => {
        this.setState({favorites: favorites})
    }

    componentDidMount() {
        FavoritesObservable.subscribe(this.favoritesObserver)
    }

    componentWillUnmount() {
        FavoritesObservable.unsubscribe(this.favoritesObserver)
    }


    order = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        this.setState({redirectOrder: true});
    }
    favorites = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        this.setState({redirectFavorites: true});
    }

    logout = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        this.setState({redirectLogout: true});
    }

    render() {
        if (this.state.redirectLogout) {
            return <Navigate to="/changeName"/>
        }
        if (this.state.redirectOrder) {
            return <Navigate to="/order"/>
        }
        if (this.state.redirectFavorites) {
            return <Navigate to="/favorites"/>
        }

        return <PixmapGroup>
            {
                this.props.cart &&
                <ToggleCartPaid
                    cart={this.props.cart}
                />
            }
            <PixmapButton onClick={this.order}
                          pixmap="add"
                          text="Neue Bestellung"
                          className="primary"
                          disabled={AllCartsObservable.getValue().isSubmitted()}
            />
            {
                this.state.favorites != null &&
                this.state.favorites.favorite.length > 0 &&
                <PixmapButton
                    onClick={this.favorites}
                    pixmap="favorite"
                    text="Aus Favoriten auswählen"
                    disabled={AllCartsObservable.getValue().isSubmitted()}
                />
            }
            <PixmapButton onClick={this.logout} pixmap="logout"
                          text={'Ich bin nicht ' + this.props.name}/><br/>
        </PixmapGroup>
    }
}