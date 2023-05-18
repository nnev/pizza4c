import {BACKEND} from "./Constants.ts";
import Restaurant from "../datamodel/restaurant/restaurant.ts";
import {Observable} from "../util/Observable.ts";
import {ErrorObservable} from "../datamodel/error.ts";
import KnownRestaurant from "../datamodel/restaurant/knownRestaurant.ts";

export async function getCurrentRestaurant() {
    fetch(BACKEND + "/restaurant/current", {
        method: "GET",
    })
        .then(value => value.json())
        .then(value => {
            CurrentRestaurantObservable.setValue(value);
            return value;
        }).catch(_ => {
        ErrorObservable.setValue({
            timestamp: "",
            status: 0,
            error: "",
            message: "Fehler beim laden der Restaurant Informationen.",
            path: ""
        });
    })
}

export async function getKnownRestaurants(): Promise<KnownRestaurant[]> {
    return fetch(BACKEND + "/restaurant/list", {
        method: "GET",
    })
        .then(value => value.json())
}

export async function setCurrentRestaurant(restaurant: string): Promise<boolean> {
    return fetch(BACKEND + "/restaurant/change/" + restaurant, {
        method: "POST",
    })
        .then(value => value.json())
        .then(value => {
            if (value) {
                return getCurrentRestaurant().then(_ => true)
            }
            return false;
        })
}

export const CurrentRestaurantObservable = new Observable<Restaurant>({initialValue: undefined});

export async function forceRestaurantRefresh() {
    return fetch(BACKEND + "/restaurant/refresh", {
        method: "POST"
    })
        .then(value => value.json())
        .then(value => {
            if (value) {
                return getCurrentRestaurant().then(_ => true)
            }
            return false;
        });
}