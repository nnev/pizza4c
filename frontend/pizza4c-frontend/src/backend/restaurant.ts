import {BACKEND} from "./Constants";
import Restaurant from "../datamodel/restaurant/restaurant";
import {Observable} from "../util/Observable";
import {ErrorObservable} from "../datamodel/error";

export async function getCurrentRestaurant() {
    fetch(BACKEND + "/restaurant/current", {
        method: "GET",
        credentials: "include"
    })
        .then(value => value.json())
        .then(value => {
            CurrentRestaurantObservable.setValue(value);
            return value;
        }).catch(reason => {
        ErrorObservable.setValue({
            timestamp: "",
            status: 0,
            error: "",
            message: "Could not reach backend",
            path: ""
        });
    })
}

export const CurrentRestaurantObservable = new Observable<Restaurant>({initialValue: undefined});