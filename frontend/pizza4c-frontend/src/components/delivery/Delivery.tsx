import React, {ChangeEvent, MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {setDelivered} from "../../backend/Cart.ts";
import {Navigate} from "react-router-dom";
import FormattedError from "../../datamodel/error.ts";
import {Error} from "../Error.tsx";
import {formatDateAsDateTime} from "../../util/Time.ts";

interface DeliveryProps {
}

interface DeliveryState {
    saved: boolean
    date: Date
    error?: FormattedError
}


export class Delivery extends React.Component<DeliveryProps, DeliveryState> {

    constructor(props: DeliveryProps, context: any) {
        super(props, context);
        this.state = {
            saved: false,
            date: new Date()
        }
    }

    changeDate = (ev: ChangeEvent<HTMLInputElement>) => {
        ev.preventDefault();
        let date = ev.target.valueAsDate || new Date();
        this.setState({date: date});
    }

    saveDate = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        setDelivered(this.state.date).then(_ => {
            this.setState({saved: true})
        }).catch(value => {
            this.setState({error: value as FormattedError})
        })
    }

    render() {
        if (this.state.saved) {
            return <Navigate to="/"/>
        }

        return <main className="notSide">
            <h1>Lieferdatum</h1>
            {this.state.error && <Error text={this.state.error.message}/>}
            <input
                type="text"
                onChange={this.changeDate}
                placeholder="dd. mm. yyyy hh:mm:ss"
                defaultValue={formatDateAsDateTime(this.state.date)}
            />
            <br />
            <PixmapButton
                onClick={this.saveDate}
                pixmap="schedule"
                text={"Lieferung eintragen"}
            />
        </main>
    }
}