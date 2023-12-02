import React from "react";
import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import {AllCartsObservable} from "../../backend/Cart.ts";
import {MyCart} from "./MyCart.tsx";
import {OtherCarts} from "./OtherCarts.tsx";
import AllCarts from "../../datamodel/cart/allCarts.ts";
import {FormatPrice} from "./FormatPrice.tsx";
import {ProgressMoney} from "../Progress.tsx";
import {Admin, AdminObservable} from "../../datamodel/admin.ts";
import {Name, UserNameObservable} from "../../datamodel/name.ts";
import {Navigate} from "react-router-dom";
import {OverviewDelivery} from "./OverviewDelivery.tsx";


interface OverviewProps {
}

interface OverviewState {
    restaurant?: Restaurant
    allCarts?: AllCarts;
    isAdmin: boolean
    name?: Name;
}

export class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps, context: any) {
        super(props, context);
        this.state = {isAdmin: false}
    }

    adminObserver = (value: Admin) => {
        this.setState({isAdmin: value.isAdmin});
    }

    restaurantObserver = (value: Restaurant) => {
        this.setState({restaurant: value});
    }

    allCartsObserver = (carts: AllCarts) => {
        this.setState({allCarts: carts});
    }

    nameObserver = (name: Name) => {
        this.setState({name: name});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.restaurantObserver);
        AllCartsObservable.subscribe(this.allCartsObserver);
        AdminObservable.subscribe(this.adminObserver)
        UserNameObservable.subscribe(this.nameObserver)
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.restaurantObserver);
        AllCartsObservable.unsubscribe(this.allCartsObserver);
        AdminObservable.unsubscribe(this.adminObserver);
        UserNameObservable.unsubscribe(this.nameObserver);
    }

    render() {
        if (!this.state.allCarts || !this.state.restaurant) {
            return <></>
        }

        if (this.state.name == null) {
            return <Navigate to="/changeName"/>;
        }

        let menu = this.state.restaurant.menu;

        return (
            <main className="notSide">
                <MyCart allCarts={this.state.allCarts} restaurant={this.state.restaurant}/>
                <br/>
                <OverviewDelivery allCarts={this.state.allCarts}  restaurant={this.state.restaurant}/>
                <h1>Money Pile: </h1>
                Summe:&nbsp;
                <FormatPrice price={this.state.allCarts.getTotalValue(menu)}/>
                <br/>
                Bezahlt:&nbsp;
                <FormatPrice price={this.state.allCarts.getPayedValue(menu)}/>
                <br/>
                Nicht Bezahlt:&nbsp;
                <FormatPrice price={this.state.allCarts.getUnpayedValue(menu)}/>
                <ProgressMoney
                    current={this.state.allCarts.getPayedValue(menu)}
                    max={this.state.allCarts.getTotalValue(menu)}
                />
                <h1>Gesamter Warenkorb</h1>
                <OtherCarts
                    restaurant={this.state.restaurant}
                    allCarts={this.state.allCarts}
                    isAdmin={this.state.isAdmin}
                />
            </main>
        )
    }
}