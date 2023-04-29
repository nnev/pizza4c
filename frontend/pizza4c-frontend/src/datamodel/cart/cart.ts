import CartEntry from "./cartEntry.ts";
import {Menu} from "../restaurant/menu.ts";
import {sumReducer} from "../../util/Reducers.ts";
import {Name} from "../name.ts";

export default class Cart {
    id: string;
    name: string;
    entries: CartEntry[];
    payed: boolean;
    shortName: string;

    constructor(id: string, name: string, entries: CartEntry[], isPayed: boolean, shortName: string) {
        this.id = id;
        this.name = name;
        this.entries = entries;
        this.payed = isPayed;
        this.shortName = shortName;
    }

    public getPrice(menu: Menu): number {
        return this.entries.map(value => value.getPrice(menu)).reduce(sumReducer, 0);
    }

    public getPaymentClass(): string {
        return this.payed ? "payed" : "unpayed"
    }

    public isMyCart(name?: Name): boolean {
        if (name === undefined) {
            return false;
        }
        return this.name === name.longName;
    }
}