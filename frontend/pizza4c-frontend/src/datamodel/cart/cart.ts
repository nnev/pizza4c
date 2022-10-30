import CartEntry from "./cartEntry";
import {Menu} from "../restaurant/menu";
import {sumReducer} from "../../util/Reducers";

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
}