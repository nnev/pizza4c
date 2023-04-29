import React, {MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {Navigate} from "react-router-dom";
import FormattedError from "../../datamodel/error.ts";
import {Error} from "../Error.tsx";
import {forceRestaurantRefresh} from "../../backend/restaurant.ts";

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