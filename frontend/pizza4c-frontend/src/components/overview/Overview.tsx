import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import {AllCartsObservable} from "../../backend/Cart";
import {MyCart} from "./MyCart";
import {sumReducer} from "../../util/Reducers";
import {OtherCarts} from "./OtherCarts";
import AllCarts from "../../datamodel/cart/allCarts";
import formatUnixTimestamp from "../../util/Time";
import {FormatPrice} from "./FormatPrice";
import {Progress} from "../Progress";
import {AdminObservable} from "../../datamodel/admin";


interface OverviewProps {
}

interface OverviewState {
    restaurant?: Restaurant
    allCarts?: AllCarts;
    isAdmin: boolean
}

export class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps, context: any) {
        super(props, context);
        this.state = {isAdmin: false}
    }

    adminObserver = (value: boolean) => {
        this.setState({isAdmin: value});
    }

    restaurantObserver = (value: Restaurant) => {
        this.setState({restaurant: value});
    }

    allCartsObserver = (carts: AllCarts) => {
        this.setState({allCarts: carts});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.restaurantObserver);
        AllCartsObservable.subscribe(this.allCartsObserver);
        AdminObservable.subscribe(this.adminObserver)
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.restaurantObserver);
        AllCartsObservable.unsubscribe(this.allCartsObserver);
        AdminObservable.unsubscribe(this.adminObserver);
    }

    render() {
        if (!this.state.allCarts || !this.state.restaurant) {
            return <></>
        }

        let menu =this.state.restaurant.menu;

        return (
            <main className="notSide">
                <MyCart allCarts={this.state.allCarts} restaurant={this.state.restaurant}/>
                <br/>
                {this.state.allCarts.submittedAt > 0 &&
                    <div className="error">
                        <span>Submitted {formatUnixTimestamp(this.state.allCarts.submittedAt)}</span>
                    </div>
                }
                <h1>Money Pile: </h1>
                Summe:&nbsp;
                <FormatPrice price={this.state.allCarts.getTotalValue(menu)}/>
                <br/>
                Bezahlt:&nbsp;
                <FormatPrice price={this.state.allCarts.getPayedValue(menu)} />
                <br/>
                Nicht Bezahlt:&nbsp;
                <FormatPrice price={this.state.allCarts.getUnpayedValue(menu)} />
                <Progress
                    current={this.state.allCarts.getPayedValue(menu)}
                    max={this.state.allCarts.getTotalValue(menu)}
                />
                <h1>The Orders of Others</h1>
                <OtherCarts
                    restaurant={this.state.restaurant}
                    allCarts={this.state.allCarts}
                    isAdmin={this.state.isAdmin}
                />
            </main>
        )
    }
}