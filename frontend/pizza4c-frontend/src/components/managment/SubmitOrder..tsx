import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {Navigate} from "react-router-dom";

interface SubmitOrderProps {
}

interface SubmitOrderState {
    submitOrder: boolean
}


export default class SubmitOrder extends React.Component<SubmitOrderProps, SubmitOrderState> {
    constructor(props: SubmitOrderProps, context: any) {
        super(props, context);
        this.state = {
            submitOrder: false
        }
    }

    handleSubmitOrder = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        this.setState({submitOrder: true});
    }

    render() {
        if (this.state.submitOrder) {
            return <Navigate to="/submitGroupOrder"/>
        }
        return (
            <>
                <h1>Bestellung abschicken</h1>
                <PixmapButton
                    onClick={this.handleSubmitOrder}
                    pixmap="send"
                    text="Bestellung abschicken"
                />
            </>
        )
    }
}