import {BACKEND} from "./Constants";
import Restaurant from "../datamodel/restaurant";

export function getCurrentRestaurant(): Promise<Restaurant>{
    return fetch(BACKEND +"/restaurant/current",{
        method: "GET",
        credentials: "include"
    }).then(value => value.json())
}