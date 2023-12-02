import Cart from "../../datamodel/cart/cart.ts";
import React from "react";
import {ToggleCartPaid} from "./ToggleCartPaid.tsx";
import {PixmapGroup, PixmapLink} from "../Pixmap.tsx";
import {AllCartsObservable} from "../../backend/Cart.ts";
import {Favorites, FavoritesObservable} from "../../datamodel/favorites.ts";

interface MyCartHeaderProps {
    cart?: Cart;
    name: string
}

interface MyCartHeaderState {
    favorites?: Favorites;
}


export class MyCartHeader extends React.Component<MyCartHeaderProps, MyCartHeaderState> {

    constructor(props: MyCartHeaderProps, context: any) {
        super(props, context);
        this.state = {}
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


    render() {
        return <PixmapGroup>
            {
                this.props.cart &&
                <ToggleCartPaid
                    cart={this.props.cart}
                />
            }
            <PixmapLink to="/order"
                        pixmap="add"
                        text="Neue Bestellung"
                        className="primary"
                        disabled={AllCartsObservable.getValue().isSubmitted()}
            />
            {
                this.state.favorites != null &&
                this.state.favorites.favorite.length > 0 &&
                //AllCartsObservable.getValue().isSubmitted() &&
                <PixmapLink
                    to="/favorites"
                    pixmap="favorite"
                    text="Aus Favoriten auswählen"
                    disabled={AllCartsObservable.getValue().isSubmitted()}
                />
            }
            <PixmapLink to="/changeName"
                        pixmap="logout"
                        text={'Ich bin nicht ' + this.props.name}/><br/>
        </PixmapGroup>
    }
}