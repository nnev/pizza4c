import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {newAllOrders} from "../../backend/Cart.ts";
import {Navigate} from "react-router-dom";
import FormattedError from "../../datamodel/error.ts";
import {Error} from "../Error.tsx";

interface NewAllOrdersProps {
}

interface NewAllOrdersState {
    done: boolean;
    error?: FormattedError
}


export default class NewAllOrders extends React.Component<NewAllOrdersProps, NewAllOrdersState> {
    constructor(props: NewAllOrdersProps, context: any) {
        super(props, context);
        this.state = {
            done: false
        }
    }

    handleNewAllOrders = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        newAllOrders().then(_ => {
            this.setState({done: true})
        })
            .catch(value => {
                this.setState({error: value as FormattedError})
            })
    }

    render() {
        if (this.state.done) {
            return <Navigate to="/"/>;
        }

        return (
            <>
                <h1>Gruppenbestellung neu aufbauen</h1>
                {this.state.error && <Error text={this.state.error.message}/>}
                <PixmapButton
                    onClick={this.handleNewAllOrders}
                    pixmap="delete_forever"
                    text="Gruppenbestellung neu aufbauen"
                />
            </>
        )
    }
}