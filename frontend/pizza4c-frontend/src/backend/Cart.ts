import {BACKEND} from "./Constants";
import {Observable} from "../util/Observable";
import Cart from "../datamodel/cart/cart";
import CartEntry from "../datamodel/cart/cartEntry";

export async function addToCart(product: string, variant: string, options: Map<string, Set<string>>): Promise<any> {
    function replacer(key: any, value: any) {
        if (value instanceof Map) {
            return Object.fromEntries(value);
        } else if (value instanceof Set) {
            return Array.from(value);
        } else {
            return value;
        }
    }

    return fetch(BACKEND + "/addToCart", {
        method: "POST",
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product: product,
            variant: variant,
            options: options
        }, replacer)
    })
        .then(value => value.json())
        .then(value => mapCart(value))
        .then(value => {
            MyCartObservable.setValue(value);
            return value;
        })
        .then(value => fetchAllCarts());
}

export const MyCartObservable = new Observable<Cart>();

export async function fetchAllCarts(): Promise<Cart[]> {
    return fetch(BACKEND + "/allCarts", {
        method: "GET",
        credentials: "include",
    })
        .then(value => value.json())
        .then(value => {
            return value.map(mapCart);
        })
        .then(value => {
            AllCartsObservable.setValue(value);
            return value;
        })
}

export const AllCartsObservable = new Observable<Cart[]>();

export async function fetchMyCart(): Promise<Cart> {
    return fetch(BACKEND + "/myCart", {
        method: "GET",
        credentials: "include",
    })
        .then(value => value.json())
        .then(value => mapCart(value))
        .then(value => {
            MyCartObservable.setValue(value);
            return value;
        })
}

function mapCart(data: Cart): Cart {
    let id = data.id;
    let name = data.name;
    let entries = data.entries.map(mapEntries);
    let payed = data.payed;
    let shortName = data.shortName;
    return new Cart(id, name, entries, payed, shortName);
}

function mapEntries(data: CartEntry): CartEntry {
    let id = data.id;
    let product = data.product;
    let variant = data.variant;
    let options = data.options;

    return new CartEntry(id, product, variant, options);
}


export async function markAsPaid(cart: Cart): Promise<Cart> {
    return fetch(BACKEND + "/markPaid/" + cart.id, {
        method: "POST",
        credentials: "include",
    })
        .then(value => value.json())
}

export async function markAsUnpaid(cart: Cart): Promise<Cart> {
    return fetch(BACKEND + "/markUnpaid/" + cart.id, {
        method: "POST",
        credentials: "include",
    })
        .then(value => value.json())
}
export async function removeEntry(entry: CartEntry): Promise<Cart> {
    return fetch(BACKEND + "/remove/" + entry.id, {
        method: "POST",
        credentials: "include",
    })
        .then(value => value.json())
}
