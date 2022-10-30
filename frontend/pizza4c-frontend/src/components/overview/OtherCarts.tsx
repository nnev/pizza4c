import React from "react";
import {sumReducer} from "../../util/Reducers";
import {Progress} from "../Progress";
import {CartsView} from "./CartsView";
import Restaurant from "../../datamodel/restaurant/restaurant";
import Cart from "../../datamodel/cart/cart";
import {SumPrice} from "./SumPrice";

interface OtherCartsProps {
    restaurant: Restaurant
    allCarts: Cart[]
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

        if (this.props.allCarts.map(value => value.entries.length).reduce(sumReducer, 0) === 0) {
            return <>No orders yet</>
        }

        return (
            <>
                <Progress
                    current={this.props.allCarts.filter(value => value.payed).map(value => value.getPrice(this.props.restaurant.menu)).reduce(sumReducer, 0)}
                    max={this.props.allCarts.map(value => value.getPrice(this.props.restaurant.menu)).reduce(sumReducer, 0)}
                />

                Summe:&nbsp;
                <SumPrice
                    carts={this.props.allCarts}
                    restaurant={this.props.restaurant}
                />
                <br/>
                Bezahlt:&nbsp;
                <SumPrice
                    carts={this.props.allCarts.filter(value => value.payed)}
                    restaurant={this.props.restaurant}
                />
                <br/>
                Nicht Bezahlt:&nbsp;
                <SumPrice
                    carts={this.props.allCarts.filter(value => !value.payed)}
                    restaurant={this.props.restaurant}
                />
                <CartsView carts={this.props.allCarts}
                           restaurant={this.props.restaurant}/>
            </>
        )
    }
}