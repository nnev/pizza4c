import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap";
import {cancelAllOrders} from "../../backend/Cart";
import {Navigate} from "react-router-dom";
import FormattedError from "../../datamodel/error";
import {Error} from "../Error";
import {forceRestaurantRefresh} from "../../backend/restaurant";

interface ForceRestaurantUpdateProps {
}

interface ForceRestaurantUpdateState {
    updated: boolean;
    error?: FormattedError
}


export default class ForceRestaurantUpdate extends React.Component<ForceRestaurantUpdateProps, ForceRestaurantUpdateState> {
    constructor(props: ForceRestaurantUpdateProps, context: any) {
        super(props, context);
        this.state = {
            updated: false
        }
    }

    handleForceRestaurantUpdate = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        forceRestaurantRefresh().then(value => {
            this.setState({updated: value})
        })
            .catch(value => {
                this.setState({error: value as FormattedError})
            })
    }

    render() {
        if (this.state.updated) {
            return <Navigate to="/"/>;
        }

        return (
            <>
                <h1>Restaurant Menu neu laden</h1>
                {this.state.error && <Error text={this.state.error.message}/>}
                <PixmapButton
                    onClick={this.handleForceRestaurantUpdate}
                    pixmap="refresh"
                    text="Restaurant Menu neu laden"
                />
            </>
        )
    }
}