import Cart from "./cart.ts";
import {sumReducer} from "../../util/Reducers.ts";
import {Menu} from "../restaurant/menu.ts";

export default class AllCarts {
    carts: Cart[];
    submittedAt: number;

    constructor(carts: Cart[], submittedAt: number) {
        this.carts = carts;
        this.submittedAt = submittedAt;
    }

    public hasOrders(): boolean {
        return this.carts.map(value => value.entries.length).reduce(sumReducer, 0) !== 0;
    }

    public getPayedValue(menu: Menu): number {
        return this.carts.filter(value => value.payed).map(value => value.getPrice(menu)).reduce(sumReducer, 0);
    }
    public getUnpayedValue(menu: Menu): number {
        return this.carts.filter(value => !value.payed).map(value => value.getPrice(menu)).reduce(sumReducer, 0);
    }
    public getTotalValue(menu: Menu): number {
        return this.carts.map(value => value.getPrice(menu)).reduce(sumReducer, 0);
    }
}