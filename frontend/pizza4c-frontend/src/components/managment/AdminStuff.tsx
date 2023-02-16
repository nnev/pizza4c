import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap";
import {AdminObservable} from "../../datamodel/admin";
import ChangeRestaurant from "./ChangeRestaurant";
import {Link} from "react-router-dom";

interface AdminStuffProps {
}

interface AdminStuffState {
    submitOrder: boolean
}


export default class AdminStuff extends React.Component<AdminStuffProps, AdminStuffState> {

    constructor(props: AdminStuffProps, context: any) {
        super(props, context);
        this.state = {
            submitOrder: false
        }
    }

    dropAdmin = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        AdminObservable.setValue(false);
    }

    render() {
        if (this.state.submitOrder) {
            return <Link to="/submitGroupOrder" className="borderRight">Bestellung abschicken</Link>
        }
        return (
            <>
                <h1>Bestellung abschicken</h1>
                <PixmapButton
                    onClick={this.handleSubmitOrder}
                    pixmap="send"
                    text="Bestellung abschicken"
                />
                <ChangeRestaurant/>
                <h1>TODO: Force update Restaurant Menu</h1>
                <h1>TODO: Cancel All Orders</h1>

                <h1>Ich will nicht mehr Admin sein</h1>
                <PixmapButton
                    onClick={this.dropAdmin}
                    pixmap="person_remove"
                    text="Admin Rechte abgeben"
                />
            </>
        )
    }

    handleSubmitOrder = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        this.setState({submitOrder: true});
    }
}