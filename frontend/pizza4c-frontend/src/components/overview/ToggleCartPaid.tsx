import React from "react";
import {PixmapButton} from "../Pixmap.tsx";
import Cart from "../../datamodel/cart/cart.ts";
import {fetchAllCarts, markAsPaid, markAsUnpaid} from "../../backend/Cart.ts";

interface ToggleCartPaidProps {
    cart: Cart;
    className?: string;
}

interface ToggleCartPaidState {
}

export class ToggleCartPaid extends React.Component<ToggleCartPaidProps, ToggleCartPaidState> {
    onMarkPaid = () => markAsPaid(this.props.cart).then(_ => fetchAllCarts())
    onMarkUnpaid = () => markAsUnpaid(this.props.cart).then(_ => fetchAllCarts())

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