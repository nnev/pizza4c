import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {AdminObservable, InvalidAdmin} from "../../datamodel/admin.ts";
import ChangeRestaurant from "./ChangeRestaurant.tsx";
import CancelAllOrders from "./CancelAllOrders..tsx";
import SubmitOrder from "./SubmitOrder..tsx";
import ForceRestaurantUpdate from "./ForceRestaurantUpdate.tsx";
import NewAllOrders from "./NewAllOrders..tsx";

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
        AdminObservable.setValue(InvalidAdmin);
    }

    render() {
        return (
            <>
                <SubmitOrder/>
                <ChangeRestaurant/>
                <ForceRestaurantUpdate/>
                <CancelAllOrders/>
                <NewAllOrders/>

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