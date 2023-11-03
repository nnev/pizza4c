import {BACKEND} from "./Constants.ts";
import {CurrentRestaurantObservable} from "../datamodel/restaurant/restaurant.ts";
import {ErrorObservable} from "../datamodel/error.ts";
import KnownRestaurant from "../datamodel/restaurant/knownRestaurant.ts";
import {Observable} from "../util/Observable.ts";

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
        .then(value => {
            KnownRestaurantObservable.setValue(value);
            return value
        })
}

export const KnownRestaurantObservable = new Observable<KnownRestaurant[]>({
    initializer: () => {
        getKnownRestaurants().then(KnownRestaurantObservable.setValue);
        return [];
    }
})