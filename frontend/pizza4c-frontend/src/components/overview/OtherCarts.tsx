import React from "react";
import {sumReducer} from "../../util/Reducers";
import {Progress} from "../Progress";
import {CartsView} from "./CartsView";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {FormatPrice} from "./FormatPrice";
import AllCarts from "../../datamodel/cart/allCarts";

interface OtherCartsProps {
    restaurant: Restaurant
    allCarts: AllCarts
}

interface OtherCartsState {
}

export class OtherCarts extends React.Component<OtherCartsProps, OtherCartsState> {
    constructor(props: OtherCartsProps, context: any) {
        super(props, context);
        this.state = {}
    }

    render() {
        if (!this.props.allCarts || !this.props.restaurant) {
            return <></>
        }

        if (!this.props.allCarts.hasOrders()) {
            return <>No orders yet</>
        }

        return (
            <>
                <CartsView carts={this.props.allCarts.carts}
                           restaurant={this.props.restaurant}/>
            </>
        )
    }
}