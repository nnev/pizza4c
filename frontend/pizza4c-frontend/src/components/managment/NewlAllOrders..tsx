import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap";
import {cancelAllOrders, newAllOrders} from "../../backend/Cart";
import {Navigate} from "react-router-dom";
import FormattedError from "../../datamodel/error";
import {Error} from "../Error";

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
        newAllOrders().then(value => {
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
                    pixmap="reset"
                    text="Gruppenbestellung neu aufbauen"
                />
            </>
        )
    }
}