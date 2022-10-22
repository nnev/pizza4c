import Cart from "../../datamodel/cart/cart";
import Restaurant from "../../datamodel/restaurant/restaurant";
import React from "react";
import {getVariant} from "../../datamodel/restaurant/menu";
import {OptionListView} from "./OptionListView";
import {ToggleCartPaid} from "./ToggleCartPaid";
import {fetchAllCarts, markAsPaid, markAsUnpaid} from "../../backend/Cart";
import {RemoveEntry} from "./RemoveEntry";

interface CartViewProps {
    cart: Cart;
    restaurant: Restaurant;
}

interface CartViewState {
}

export class CartView extends React.Component<CartViewProps, CartViewState> {
    render() {
        let menu = this.props.restaurant.menu;

        let results: JSX.Element[] = [];

        this.props.cart.entries.forEach((entry, index) => {
            let variant = getVariant(menu, entry.product, entry.variant);
            results.push(
                <tr key={entry.id} className={index == 0 ? "cartBegin" : ""}>
                    <td className="grow"><OptionListView entry={entry} restaurant={this.props.restaurant}/></td>
                    <td>{variant && variant.name}</td>
                    <td className="textRight">{entry.getPrice(menu).toFixed(2)} €</td>
                    {index == 0 && <>
                        <td className="textRight" rowSpan={this.props.cart.entries.length}>{this.props.cart.name}</td>
                        <td className="textRight" rowSpan={this.props.cart.entries.length}>{this.props.cart.shortName}</td>
                        <td className="textRight" rowSpan={this.props.cart.entries.length}>
                            <ToggleCartPaid
                                cart={this.props.cart}
                                className="grow"
                            />
                            <br />
                            <RemoveEntry
                                entry={entry}
                                className="grow"
                            />
                        </td>
                    </>
                    }
                </tr>
            )
        })

        return results;
    }
}