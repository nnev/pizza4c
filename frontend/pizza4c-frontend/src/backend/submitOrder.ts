import {BACKEND} from "./Constants";

export async function submitOrder(): Promise<boolean> {
    return fetch(BACKEND + "/submitOrder", {
        method: "POST",
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(value => value.json())
}