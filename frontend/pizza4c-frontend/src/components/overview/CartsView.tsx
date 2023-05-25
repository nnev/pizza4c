import Cart from "../../datamodel/cart/cart.ts";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import React from "react";
import {CartView} from "./CartView.tsx";

interface CartsViewProps {
    carts: Cart[];
    restaurant: Restaurant;

    isAdmin: boolean;
}

interface CartsViewState {
}

export class CartsView extends React.Component<CartsViewProps, CartsViewState> {

    constructor(props: CartsViewProps, context: any) {
        super(props, context);
    }

    render() {

        let view: JSX.Element[] = [];
        this.props.carts
            .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            .forEach(cart => {
                view.push(<CartView
                    key={cart.id}
                    cart={cart}
                    restaurant={this.props.restaurant}
                    isAdmin={this.props.isAdmin}
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