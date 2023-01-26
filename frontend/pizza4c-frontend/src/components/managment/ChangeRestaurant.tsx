import React, {ChangeEvent, MouseEvent} from "react";
import {PixmapButton} from "../Pixmap";
import {CurrentRestaurantObservable, getKnownRestaurants, setCurrentRestaurant} from "../../backend/restaurant";
import KnownRestaurant from "../../datamodel/restaurant/knownRestaurant";
import Restaurant from "../../datamodel/restaurant/restaurant";

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
        this.state = {
            restaurantName: CurrentRestaurantObservable.getValue().restaurantSlug,
            nameChanged: undefined
        }
    }

    listener = (value: Restaurant) => {
        this.setState({
            currentRestaurant: value,
        });
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
        getKnownRestaurants().then(value => this.setState({
            knownRestaurants: value
        }));
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
        this.setState({knownRestaurants: undefined})
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
        if (this.state.knownRestaurants === undefined || this.state.currentRestaurant === undefined) {
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
                    placeholder="Restaurant"
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
                {this.state.nameChanged === true && <span className="payed">Geändert auf {this.state.currentRestaurant.restaurantSlug}</span>}
                {this.state.nameChanged === false && <span className="unpayed">Änderung fehlgeschlagen</span>}
            </>
        );
    }
}