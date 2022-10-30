import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import {AllCartsObservable} from "../../backend/Cart";
import Cart from "../../datamodel/cart/cart";
import {CartsView} from "./CartsView";
import {MyCart} from "./MyCart";
import {sumReducer} from "../../util/Reducers";
import {Progress} from "../Progress";
import {OtherCarts} from "./OtherCarts";


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
                <MyCart/>
                <br/>
                <h1>Money Pile: </h1>
                Total: {this.state.allCarts.map(value => value.getPrice(this.state.restaurant!.menu)).reduce(sumReducer, 0).toFixed(2)} €

                <h1>The Orders of Others</h1>
                <OtherCarts restaurant={this.state.restaurant} allCarts={this.state.allCarts}/>
            </main>
        )
    }
}