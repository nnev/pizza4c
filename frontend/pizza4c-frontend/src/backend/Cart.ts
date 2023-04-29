import {BACKEND} from "./Constants.ts";
import {Observable} from "../util/Observable.ts";
import Cart from "../datamodel/cart/cart.ts";
import CartEntry from "../datamodel/cart/cartEntry.ts";
import AllCarts from "../datamodel/cart/allCarts.ts";
import FormattedError from "../datamodel/error.ts";
import {getMyName} from "../datamodel/name.ts";

export async function addToCart(product: string, variant: string, options: Map<string, Set<string>>, comment?: string): Promise<any> {
    function replacer(_: any, value: any) {
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
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product: product,
            variant: variant,
            options: options,
            name: getMyName().asBody(),
            comment: comment
        }, replacer)
    })
        .then(value => value.json())
        .then(value => {
            if ((<FormattedError>value).error !== undefined) {
                throw value as FormattedError;
            } else {
                return fetchAllCarts();
            }
        })
}


export async function fetchAllCarts(): Promise<AllCarts> {
    return fetch(BACKEND + "/allCarts", {
        method: "GET",
    })
        .then(value => value.json())
        .then(value => mapAllCarts(value))
        .then(value => {
            AllCartsObservable.setValue(value);
            return value;
        })
}

export const AllCartsObservable = new Observable<AllCarts>({});

function mapAllCarts(data: AllCarts): AllCarts {
    let carts = data.carts;
    let submittedAt = data.submittedAt;
    return new AllCarts(carts.map(mapCart), submittedAt);
}

function mapCart(data: Cart): Cart {
    let id = data.id;
    let name = data.name;
    let entries = data.entries == undefined ? [] : data.entries.map(mapEntries);
    let payed = data.payed;
    let shortName = data.shortName;
    return new Cart(id, name, entries, payed, shortName);
}

function mapEntries(data: CartEntry): CartEntry {
    let id = data.id;
    let product = data.product;
    let variant = data.variant;
    let options = data.options;
    let comment = data.comment;

    return new CartEntry(id, product, variant, options, comment);
}

export async function markAsPaid(cart: Cart): Promise<boolean> {
    return fetch(BACKEND + "/markPaid/" + cart.id, {
        method: "POST",
        body: JSON.stringify({
            name: getMyName().asBody()
        })
    })
        .then(value => value.json())
        .then(value => {
            if ((<FormattedError>value).error !== undefined) {
                throw value as FormattedError;
            } else {
                return value as boolean;
            }
        })
}

export async function markAsUnpaid(cart: Cart): Promise<boolean> {
    return fetch(BACKEND + "/markUnpaid/" + cart.id, {
        method: "POST",
        body: JSON.stringify({
            name: getMyName().asBody()
        })
    })
        .then(value => value.json())
        .then(value => {
            if ((<FormattedError>value).error !== undefined) {
                throw value as FormattedError;
            } else {
                return value as boolean;
            }
        })
}

export async function removeEntry(entry: CartEntry): Promise<boolean> {
    return fetch(BACKEND + "/remove/" + entry.id, {
        method: "POST",
    })
        .then(value => value.json())
        .then(value => {
            if ((<FormattedError>value).error !== undefined) {
                throw value as FormattedError;
            } else {
                return value as boolean;
            }
        })
}

export async function cancelAllOrders(): Promise<boolean> {
    return fetch(BACKEND + "/cancelAllOrders", {
        method: "POST",
    })
        .then(value => value.json())
        .then(value => {
            if ((<FormattedError>value).error !== undefined) {
                throw value as FormattedError;
            } else {
                return value as boolean;
            }
        })
}

export async function newAllOrders(): Promise<AllCarts> {
    return fetch(BACKEND + "/allCarts/new", {
        method: "POST",
    })
        .then(value => value.json())
        .then(value => mapAllCarts(value))
        .then(value => {
            AllCartsObservable.setValue(value);
            return value;
        })
}
