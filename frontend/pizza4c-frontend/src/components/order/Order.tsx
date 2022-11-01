import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CurrentRestaurantObservable, getCurrentRestaurant} from "../../backend/restaurant";
import {OrderSidebar} from "./OrderSidebar";
import {OrderList} from "./OrderList";

interface OrderProps {
}

interface OrderState {
    restaurant?: Restaurant
}

export class Order extends React.Component<OrderProps, OrderState> {

    constructor(props: OrderProps, context: any) {
        super(props, context);
        this.state = {}
    }

    listener = (value: Restaurant) => {
        this.setState({restaurant: value});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    render() {
        if (!this.state.restaurant) {
            return <></>
        }

        return (
            <>
                <OrderSidebar restaurant={this.state.restaurant}/>
                <main className="withSide">
                    <OrderList restaurant={this.state.restaurant}/>
                </main>
            </>
        );
    }
}