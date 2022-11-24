import Cart from "../../datamodel/cart/cart";
import Restaurant from "../../datamodel/restaurant/restaurant";
import React from "react";
import {getVariant} from "../../datamodel/restaurant/menu";
import {OptionListView} from "./OptionListView";
import {ToggleCartPaid} from "./ToggleCartPaid";
import {RemoveEntry} from "./RemoveEntry";
import {joinClasses} from "../../util/JoinClasses";
import {AllCartsObservable} from "../../backend/Cart";

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

        if (this.props.cart.entries.length === 0) {
            return <></>
        }

        results.push(
            <tr
                key={this.props.cart.id}
                className="cartBegin"
            >
                <td className={joinClasses("box", this.props.cart.getPaymentClass())}>&nbsp;</td>
                <td className="grow">{this.props.cart.name}</td>
                <td>{this.props.cart.shortName}</td>
                <td></td>
                <td>
                    <ToggleCartPaid
                        cart={this.props.cart}
                        className="grow"
                    />
                </td>
            </tr>
        )
        this.props.cart.entries.forEach((entry, index) => {
            let variant = getVariant(menu, entry.product, entry.variant);
            results.push(
                <tr key={entry.id}>
                    <td className={joinClasses("box", this.props.cart.getPaymentClass())}>&nbsp;</td>
                    <td className="grow"><OptionListView entry={entry} restaurant={this.props.restaurant}/></td>
                    <td>{variant && variant.name}</td>
                    <td className="textCenter">{entry.getPrice(menu).toFixed(2)} €</td>
                    <td className="textCenter">
                        <RemoveEntry
                            entry={entry}
                            className="grow tiny"
                        />
                    </td>
                </tr>
            )
        })

        return results;
    }
}