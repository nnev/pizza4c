import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {CurrentRestaurantObservable} from "../../backend/restaurant.ts";
import {Favorites, FavoritesObservable} from "../../datamodel/favorites.ts";
import {FavoritesEntry} from "./FavoritesEntry.tsx";
import {PixmapButton} from "../Pixmap.tsx";
import {Navigate} from "react-router-dom";

interface FavoritesProps {

}

interface FavoritesState {
    restaurant?: Restaurant
    favorites?: Favorites
    backToOrder: boolean
}

export class FavoritesComponent extends React.Component<FavoritesProps, FavoritesState> {
    constructor(props: FavoritesProps, context: any) {
        super(props, context);
        this.state = {backToOrder: false}
    }

    restaurantObserver = (restaurant: Restaurant) => {
        this.setState({restaurant: restaurant})
    }

    favoritesObserver = (favorites: Favorites) => {
        this.setState({favorites: favorites})
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.restaurantObserver)
        FavoritesObservable.subscribe(this.favoritesObserver)
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.restaurantObserver)
        FavoritesObservable.unsubscribe(this.favoritesObserver)
    }

    backToOrder = () => {
        this.setState({backToOrder: true});
    }

    render() {
        if (this.state.backToOrder) {
            return <Navigate to={"/order"}/>;
        }

        if (this.state.favorites == undefined || this.state.restaurant == undefined) {
            return <></>;
        }

        if (this.state.favorites.favorite.length == 0) {
            return (
                <main className="notSide">
                    <form>
                        <h1>Noch keine Favoriten hinterlegt</h1>
                        Du hast noch keine Favoriten gespeichert. <br/>

                        <PixmapButton
                            onClick={this.backToOrder}
                            pixmap="arrow_back"
                            text="Zurück zur Produktauswahl"
                            className="primary"
                        />
                    </form>
                </main>
            )
        }

        return (
            <main className="notSide favorites">
                <form>
                    <h1>Deine Favoriten</h1>
                    {
                        this.state.favorites.favorite.map(f => (
                            <FavoritesEntry entry={f} restaurant={this.state.restaurant!!}/>
                        ))
                    }
                </form>
            </main>
        );
    }
}