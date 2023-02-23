import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap";
import {AdminObservable} from "../../datamodel/admin";
import ChangeRestaurant from "./ChangeRestaurant";
import CancelAllOrders from "./CancelAllOrders.";
import SubmitOrder from "./SubmitOrder.";

interface AdminStuffProps {
}

interface AdminStuffState {
}


export default class AdminStuff extends React.Component<AdminStuffProps, AdminStuffState> {

    constructor(props: AdminStuffProps, context: any) {
        super(props, context);
        this.state = {}
    }

    dropAdmin = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        AdminObservable.setValue(false);
    }

    render() {
        return (
            <>
                <SubmitOrder/>
                <ChangeRestaurant/>
                <h1>TODO: Force update Restaurant Menu</h1>
                <CancelAllOrders/>

                <h1>Ich will nicht mehr Admin sein</h1>
                <PixmapButton
                    onClick={this.dropAdmin}
                    pixmap="person_remove"
                    text="Admin Rechte abgeben"
                />
            </>
        )
    }
}