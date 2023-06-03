import React from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {AllCartsObservable, fetchAllCarts, removeEntry} from "../../backend/Cart.ts";
import CartEntry from "../../datamodel/cart/cartEntry.ts";

interface RemoveEntryProps {
    entry: CartEntry
    className?: string;
}

interface RemoveEntryState {
}

export class RemoveEntry extends React.Component<RemoveEntryProps, RemoveEntryState> {
    onRemoveEntry = () => removeEntry(this.props.entry).then(_ => fetchAllCarts())

    render() {
        return <PixmapButton
            onClick={this.onRemoveEntry}
            pixmap="delete"
            text="Aus Bestellung entfernen"
            className={this.props.className}
            disabled={AllCartsObservable.getValue().isSubmitted()}
        />
    }
}