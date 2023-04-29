import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {cancelAllOrders} from "../../backend/Cart.ts";
import {Navigate} from "react-router-dom";
import FormattedError from "../../datamodel/error.ts";
import {Error} from "../Error.tsx";

interface CancelAllOrdersProps {
}

interface CancelAllOrdersState {
    canceled: boolean;
    error?: FormattedError
}


export default class CancelAllOrders extends React.Component<CancelAllOrdersProps, CancelAllOrdersState> {
    constructor(props: CancelAllOrdersProps, context: any) {
        super(props, context);
        this.state = {
            canceled: false
        }
    }

    handleCancelAllOrders = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        cancelAllOrders().then(value => {
            this.setState({canceled: value})
        })
            .catch(value => {
                this.setState({error: value as FormattedError})
            })
    }

    render() {
        if (this.state.canceled) {
            return <Navigate to="/"/>;
        }

        return (
            <>
                <h1>Alle Bestellungen stornieren</h1>
                {this.state.error && <Error text={this.state.error.message}/>}
                <PixmapButton
                    onClick={this.handleCancelAllOrders}
                    pixmap="person_remove"
                    text="Alle Bestellungen stornieren"
                />
            </>
        )
    }
}