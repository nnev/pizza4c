import {BACKEND} from "./Constants.ts";
import {Observable} from "../util/Observable.ts";
import Cart from "../datamodel/cart/cart.ts";
import CartEntry from "../datamodel/cart/cartEntry.ts";
import AllCarts from "../datamodel/cart/allCarts.ts";
import FormattedError from "../datamodel/error.ts";
import {getMyName} from "../datamodel/name.ts";
import DeliveryTimeEstimation from "../datamodel/cart/deliveryTimeEstimation.ts";

export async function addToCart(product: string, variant: string, options: Map<string, Set<string>>, comment?: string): Promise<any> {

    // Something, something: "[Object object]" is not a useful string in a request
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

// Begin mappers.
// Transforms an object casted as X to an instance of class X
// These calls are required for methods of the class to be available on all instances

function mapAllCarts(data: AllCarts): AllCarts {
    let carts = data.carts;
    let createdAt = data.createdAt;
    let submittedAt = data.submittedAt;
    let deliveredAt = data.deliveredAt;
    let deliveryTimeEstimation = data.deliveryTimeEstimation
    return new AllCarts(
        carts.map(mapCart),
        createdAt,
        submittedAt,
        deliveredAt,
        mapDeliveryTimeEstimation(deliveryTimeEstimation)
    );
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

function mapDeliveryTimeEstimation(data?: DeliveryTimeEstimation): DeliveryTimeEstimation | undefined {
    if (data == undefined) {
        return undefined
    }
    let byTime = data.byTime;
    let byPrice = data.byPrice;

    return new DeliveryTimeEstimation(byTime, byPrice);
}

// End mappers

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
        .then(value => {
            return value;
        })
        .then(value => {
            if ((<FormattedError>value).message !== undefined) {
                console.log(value);
                throw value as FormattedError;
            } else {
                AllCartsObservable.setValue(mapAllCarts(value));
                return value;
            }
        })
}


function leftPad(value: number, length: number, padding: string) {
    let strValue = value + "";
    if (strValue.length < length) {
        return padding.repeat(length - strValue.length) + strValue;
    }
    return strValue;
}

export async function setDelivered(deliveryDate: Date): Promise<AllCarts> {
    // FFS Why is JS such a flaming piece of garbage!!!!!
    // JS Date does not have a built-in option to stringify with a zone offset specified
    // At the same time the ISO String conversation subtracts the timezone offset
    // Therefore we have to serialize it manually as a "LocalDateTime"
    let formattedDate = leftPad(deliveryDate.getFullYear(), 4, '0') + "-" +
        leftPad(deliveryDate.getMonth() + 1, 2, '0') + "-" +
        leftPad(deliveryDate.getDate(), 2, '0') + "T" +
        leftPad(deliveryDate.getHours(), 2, '0') + ":" +
        leftPad(deliveryDate.getMinutes(), 2, '0') + ":" +
        leftPad(deliveryDate.getSeconds(), 2, '0') + "Z";

    return fetch(BACKEND + "/setDelivered/" + formattedDate, {
        method: "POST",
    })
        .then(value => value.json())
        .then(value => {
            return value;
        })
        .then(value => {
            if ((<FormattedError>value).message !== undefined) {
                console.log(value);
                throw value as FormattedError;
            } else {
                AllCartsObservable.setValue(mapAllCarts(value));
                return value;
            }
        })
}
