import {BACKEND} from "./Constants";
import Restaurant from "../datamodel/restaurant/restaurant";
import {Observable} from "../util/Observable";

export async function getCurrentRestaurant() {
    fetch(BACKEND + "/restaurant/current", {
        method: "GET",
        credentials: "include"
    })
        .then(value => value.json())
        .then(value => {
            CurrentRestaurantObservable.setValue(value);
            return value;
        })
}

export const CurrentRestaurantObservable = new Observable<Restaurant>();