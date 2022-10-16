import React from "react";
import Restaurant from "../datamodel/restaurant";
import {getCurrentRestaurant} from "../backend/restaurant";
import {OrderSidebar} from "./order/OrderSidebar";
import {OrderList} from "./order/OrderList";

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

    componentDidMount() {
        this.loadRestaurant();
    }

    render() {
        if (!this.state.restaurant) {
            return <></>
        }

        return (
            <>
                <OrderSidebar restaurant={this.state.restaurant}/>
                <main>
                    <OrderList restaurant={this.state.restaurant}/>
                </main>
            </>
        );
    }

    private loadRestaurant() {
        getCurrentRestaurant().then(value => this.setState({restaurant: value}));
    }
}