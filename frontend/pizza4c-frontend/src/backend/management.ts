import Cart from "../datamodel/cart/cart";
import {BACKEND} from "./Constants";
import {fetchMyCart, MyCartObservable} from "./Cart";

export async function changeName(name: string): Promise<Cart> {
    return fetch(BACKEND + "/changeName", {
        method: "POST",
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
        })
    })
        .then(value => value.json())
        .then(fetchMyCart)
}