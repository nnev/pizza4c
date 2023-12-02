import React from "react";
import {CartsView} from "./CartsView.tsx";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import AllCarts from "../../datamodel/cart/allCarts.ts";

interface OtherCartsProps {
    restaurant: Restaurant;
    allCarts: AllCarts;

    isAdmin: boolean;
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
            return <>Es gibt noch keine Bestellungen</>
        }

        return (
            <>
                <CartsView carts={this.props.allCarts.carts}
                           restaurant={this.props.restaurant}
                           isAdmin={this.props.isAdmin}
                />
            </>
        )
    }
}