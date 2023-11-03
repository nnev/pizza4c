import React from "react";
import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import {OrderSidebar} from "./OrderSidebar.tsx";
import {OrderList} from "./OrderList.tsx";

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