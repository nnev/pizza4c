import Cart from "../../datamodel/cart/cart";
import Restaurant from "../../datamodel/restaurant/restaurant";
import React from "react";
import {CartView} from "./CartView";
import {sumReducer} from "../../util/Reducers";
import {SumPrice} from "./SumPrice";

interface CartsViewProps {
    carts: Cart[];
    restaurant: Restaurant;
}

interface CartsViewState {
}

export class CartsView extends React.Component<CartsViewProps, CartsViewState> {

    constructor(props: CartsViewProps, context: any) {
        super(props, context);
    }

    render() {

        let view: JSX.Element[] = [];
        this.props.carts.forEach(cart => {
            view.push(<CartView
                key={cart.id}
                cart={cart}
                restaurant={this.props.restaurant}
            />)
        });

        return (
            <>
                <table className="orderTable">
                    <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Product</th>
                        <th>Größe</th>
                        <th>Preis (€)</th>
                        <th>Nick</th>
                        <th>Beschriftung</th>
                        <th>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {view}
                    </tbody>
                </table>
            </>
        )
    }
}