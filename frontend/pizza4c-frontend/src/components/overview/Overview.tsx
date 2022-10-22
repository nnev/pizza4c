import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import {AllCartsObservable, fetchAllCarts} from "../../backend/Cart";
import Cart from "../../datamodel/cart/cart";
import {PixmapButton} from "../Pixmap";
import {renderPdf} from "../../backend/RenderPdf";
import {CartsView} from "./CartsView";
import {MyCart} from "./MyCart";
import {sumReducer} from "../../util/Reducers";
import {Progress} from "../Progress";


interface OverviewProps {
}

interface OverviewState {
    restaurant?: Restaurant
    allCarts?: Cart[],
}

export class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps, context: any) {
        super(props, context);
        this.state = {}
    }

    restaurantObserver = (value: Restaurant) => {
        this.setState({restaurant: value});
    }

    allCartsObserver = (carts: Cart[]) => {
        this.setState({allCarts: carts});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.restaurantObserver);
        AllCartsObservable.subscribe(this.allCartsObserver);

        fetchAllCarts();
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.restaurantObserver);
        AllCartsObservable.unsubscribe(this.allCartsObserver);
    }

    render() {
        if (!this.state.allCarts || !this.state.restaurant) {
            return <></>
        }

        return (
            <main>
                <PixmapButton onClick={() => renderPdf()} pixmap="render" text="render"/><br/>
                <MyCart/>
                <br />
                Money Pile: <br/>
                Total: {this.state.allCarts.map(value => value.getPrice(this.state.restaurant!.menu)).reduce(sumReducer, 0).toFixed(2)} €
                <Progress
                    current={this.state.allCarts.filter(value => value.payed).map(value => value.getPrice(this.state.restaurant!.menu)).reduce(sumReducer, 0)}
                    max={this.state.allCarts.map(value => value.getPrice(this.state.restaurant!.menu)).reduce(sumReducer, 0)}
                />
                <h2>Bezahlt:</h2>
                <CartsView carts={this.state.allCarts.filter(value => value.payed)}
                           restaurant={this.state.restaurant!}/>
                <h2>Nicht bezahlt</h2>
                <CartsView carts={this.state.allCarts.filter(value => !value.payed)}
                           restaurant={this.state.restaurant!}/>
            </main>
        )
    }
}