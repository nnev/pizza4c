import {BACKEND} from "./Constants.ts";
import {Admin, AdminObservable, InvalidAdmin} from "../datamodel/admin.ts";
import FormattedError from "../datamodel/error.ts";
import {getCurrentRestaurant} from "./restaurant.ts";

export async function getAdminTicket(value: string): Promise<Admin> {
    return fetch(BACKEND + "/admin/getTicket", {
        method: "POST",
        body: value
    })
        .then(value => value.json())
        .then(value => {
            let admin = new Admin(value.ticket, value.isAdmin);
            AdminObservable.setValue(admin);
            return admin;
        })
}

export async function forceRestaurantRefresh() {
    return fetch(BACKEND + "/restaurant/refresh", {
        method: "POST",
        headers: {
            "X-Admin-Ticket": AdminObservable.getValue().ticket
        }
    })
        .then(value => value.json())
        .then(value => {
            if (value) {
                if (value.message == "Not authorized to do admin tasks") {
                    AdminObservable.setValue(InvalidAdmin);
                    return false;
                }
                return getCurrentRestaurant().then(_ => true)
            }
            return false;
        })
}

export async function submitOrder(): Promise<boolean> {
    return fetch(BACKEND + "/submitOrder", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "X-Admin-Ticket": AdminObservable.getValue().ticket
        }
    })
        .then(value => value.json())
        .then(value => {
            if (value) {
                if (value.message == "Not authorized to do admin tasks") {
                    AdminObservable.setValue(InvalidAdmin);
                    return false;
                }
                return value;
            }
            return false;
        })
        .catch(reason => {
            if (reason.message == "Not authorized to do admin tasks") {
                AdminObservable.setValue(InvalidAdmin);
            } else {
                throw reason
            }
        });
}

export async function setCurrentRestaurant(restaurant: string): Promise<boolean> {
    return fetch(BACKEND + "/restaurant/change/" + restaurant, {
        method: "POST",
        headers: {
            "X-Admin-Ticket": AdminObservable.getValue().ticket
        }
    })
        .then(value => value.json())
        .then(value => {
            if (value) {
                if (value.message == "Not authorized to do admin tasks") {
                    AdminObservable.setValue(InvalidAdmin);
                    return false;
                }
                return getCurrentRestaurant().then(_ => true)
            }
            return false;
        })
}

export async function cancelAllOrders(): Promise<boolean> {
    return fetch(BACKEND + "/cancelAllOrders", {
        method: "POST",
        headers: {
            "X-Admin-Ticket": AdminObservable.getValue().ticket
        }
    })
        .then(value => value.json())
        .then(value => {
            if (value.message == "Not authorized to do admin tasks") {
                AdminObservable.setValue(InvalidAdmin);
                return false;
            }
            if ((<FormattedError>value).error !== undefined) {
                throw value as FormattedError;
            } else {
                return value as boolean;
            }
        })
}