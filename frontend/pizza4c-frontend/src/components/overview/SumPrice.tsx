import React from "react";
import {sumReducer} from "../../util/Reducers";
import Cart from "../../datamodel/cart/cart";
import Restaurant from "../../datamodel/restaurant/restaurant";

interface SumPriceProps {
    carts: Cart[];
    restaurant: Restaurant;
}

interface SumPriceState {
}

export class SumPrice extends React.Component<SumPriceProps, SumPriceState> {
    render() {
        let price = this.props.carts
            .map(value => {
                return value.getPrice(this.props.restaurant.menu);
            })
            .reduce(sumReducer, 0)
            .toFixed(2);
        return <>
            {price}€
        </>
    }

}