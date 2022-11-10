import React from "react";
import {PixmapButton} from "../Pixmap";
import Cart from "../../datamodel/cart/cart";
import {
    AllCartsObservable,
    fetchAllCarts,
    fetchMyCart,
    markAsPaid,
    markAsUnpaid,
    removeEntry
} from "../../backend/Cart";
import CartEntry from "../../datamodel/cart/cartEntry";

interface RemoveEntryProps {
    entry: CartEntry
    className?: string;
}

interface RemoveEntryState {
}

export class RemoveEntry extends React.Component<RemoveEntryProps, RemoveEntryState> {
    onRemoveEntry = () => removeEntry(this.props.entry).then(value => fetchMyCart()).then(value => fetchAllCarts())

    render() {
        return <PixmapButton
            onClick={this.onRemoveEntry}
            pixmap="remove"
            text="Aus Bestellung entfernen"
            className={this.props.className}
            disabled={AllCartsObservable.getValue().submittedAt > 0}
        />
    }
}