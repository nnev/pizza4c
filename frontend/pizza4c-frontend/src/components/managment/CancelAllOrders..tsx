import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap";
import {cancelAllOrders} from "../../backend/Cart";
import {Navigate} from "react-router-dom";
import FormattedError from "../../datamodel/error";
import {Error} from "../Error";

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