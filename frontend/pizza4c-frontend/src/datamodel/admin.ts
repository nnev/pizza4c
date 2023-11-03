import {Observable} from "../util/Observable.ts";

export class Admin {
    public ticket: string
    public isAdmin: boolean

    constructor(ticket: string, isAdmin: boolean) {
        this.ticket = ticket
        this.isAdmin = isAdmin
    }
}


export const InvalidAdmin = new Admin("invalid", false)

export const AdminObservable: Observable<Admin> = new Observable({initializer: () => InvalidAdmin});