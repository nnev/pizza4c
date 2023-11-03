import React, {ChangeEvent, MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import {getKnownRestaurants} from "../../backend/restaurant.ts";
import {addNewRestaurant} from "../../backend/Admin.ts";
import {Navigate} from "react-router-dom";

interface ChangeRestaurantProps {
}

interface ChangeRestaurantState {
    restaurantName: string;
    restaurantId: string;
    saved: boolean
}

export default class AddRestaurant extends React.Component<ChangeRestaurantProps, ChangeRestaurantState> {

    constructor(props: ChangeRestaurantProps, context: any) {
        super(props, context);
        this.state = {
            restaurantName: "",
            restaurantId: "",
            saved: false
        }
    }

    changeRestaurantName = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({restaurantName: ev.target.value})
    }
    changeRestaurantId = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({restaurantId: ev.target.value})
    }
    changeRestaurantNameSubmit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        addNewRestaurant(this.state.restaurantName, this.state.restaurantId).then(() => getKnownRestaurants());
    }

    render() {
        if (this.state.saved === undefined) {
            return <Navigate to="/"/>;
        }
        return (
            <>
                <h1>Neues Restaurant</h1>
                <label htmlFor="restaurantName">Name: </label><input
                name="restaurantAddName"
                id="restaurantAddName"
                className="restaurantAddName"
                value={this.state.restaurantName}
                placeholder="Menschenlesbarer Restaurant Name"
                onChange={this.changeRestaurantName}
            />
                <br/>
                <label htmlFor="restaurantAddId">Lieferando Slug: </label><input
                name="restaurantAddId"
                id="restaurantAddId"
                className="restaurantAddId"
                value={this.state.restaurantId}
                placeholder="Lieferando Restaurant Id"
                onChange={this.changeRestaurantId}
            />
                <br/>
                <PixmapButton
                    onClick={this.changeRestaurantNameSubmit}
                    pixmap="person_add"
                    text="Restaurant hinzufügen"
                />
            </>
        );
    }
}