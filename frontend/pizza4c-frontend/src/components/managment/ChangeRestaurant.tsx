import React, {ChangeEvent, MouseEvent} from "react";
import {PixmapButton} from "../Pixmap.tsx";
import KnownRestaurant from "../../datamodel/restaurant/knownRestaurant.ts";
import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import {getKnownRestaurants, KnownRestaurantObservable} from "../../backend/restaurant.ts";
import {setCurrentRestaurant} from "../../backend/Admin.ts";

interface ChangeRestaurantProps {
}

interface ChangeRestaurantState {
    restaurantName: string;
    nameChanged?: boolean;
    knownRestaurants?: KnownRestaurant[];
    currentRestaurant?: Restaurant;
}

export default class ChangeRestaurant extends React.Component<ChangeRestaurantProps, ChangeRestaurantState> {

    constructor(props: ChangeRestaurantProps, context: any) {
        super(props, context);
        let value = CurrentRestaurantObservable.getValueMaybe();
        this.state = {
            restaurantName: value?.restaurantSlug || "unknown",
            nameChanged: undefined
        }
        getKnownRestaurants()
    }

    listener = (value: Restaurant) => {
        this.setState({
            currentRestaurant: value,
        });
    }

    knownRestaurantListener = (value: KnownRestaurant[]) => {
        this.setState({
            knownRestaurants: value,
        });
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
        KnownRestaurantObservable.subscribe(this.knownRestaurantListener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
        KnownRestaurantObservable.unsubscribe(this.knownRestaurantListener);
    }

    changeRestaurantName = (ev: ChangeEvent<HTMLSelectElement>) => {
        this.setState({restaurantName: ev.target.value})
    }
    changeRestaurantNameSubmit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        if (this.state.knownRestaurants === undefined) {
            return
        }
        if (this.state.knownRestaurants.find(r => r.lieferandoName === this.state.restaurantName) != undefined) {
            setCurrentRestaurant(this.state.restaurantName).then(value => {
                this.setState({nameChanged: value})
            })
        }
    }

    render() {
        if (this.state.knownRestaurants === undefined) {
            return <></>;
        }
        return (
            <>
                <h1>Ausgewähltes Restaurant</h1>
                <select
                    name="restaurantName"
                    id="restaurantName"
                    className="restaurantName"
                    value={this.state.restaurantName}
                    onChange={this.changeRestaurantName}
                >
                    <option value="selectValidOption">Ein Restaurant auswählen</option>
                    {
                        this.state.knownRestaurants.map(r => (
                                <option
                                    value={r.lieferandoName}
                                    key={r.lieferandoName}
                                >{r.humanReadableName}</option>
                            )
                        )
                    }
                </select>
                <br/>
                <PixmapButton
                    onClick={this.changeRestaurantNameSubmit}
                    pixmap="person_add"
                    text="Restaurant ändern"
                />
                {this.state.nameChanged != undefined && <br/>}
                {this.state.nameChanged === true &&
                    <span className="payed">Geändert auf {this.state.currentRestaurant?.restaurantSlug}</span>}
                {this.state.nameChanged === false && <span className="unpayed">Änderung fehlgeschlagen</span>}
            </>
        );
    }
}