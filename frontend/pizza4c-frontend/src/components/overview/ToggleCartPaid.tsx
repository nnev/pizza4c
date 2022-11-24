import React from "react";
import {PixmapButton} from "../Pixmap";
import Cart from "../../datamodel/cart/cart";
import {fetchAllCarts, markAsPaid, markAsUnpaid} from "../../backend/Cart";

interface ToggleCartPaidProps {
    cart: Cart;
    className?: string;
}

interface ToggleCartPaidState {
}

export class ToggleCartPaid extends React.Component<ToggleCartPaidProps, ToggleCartPaidState> {
    onMarkPaid = () => markAsPaid(this.props.cart).then(value => fetchAllCarts())
    onMarkUnpaid = () => markAsUnpaid(this.props.cart).then(value => fetchAllCarts())

    render() {
        if (this.props.cart.payed) {
            return <PixmapButton
                onClick={this.onMarkUnpaid}
                pixmap="money_off"
                text="Unbezahlt setzen"
                className={this.props.className}
            />
        }
        return <PixmapButton
            onClick={this.onMarkPaid}
            pixmap="paid"
            text="Bezahlt setzen"
            className={this.props.className}
        />
    }
}