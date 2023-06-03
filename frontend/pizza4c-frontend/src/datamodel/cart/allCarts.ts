import Cart from "./cart.ts";
import {sumReducer} from "../../util/Reducers.ts";
import {Menu} from "../restaurant/menu.ts";
import DeliveryTimeEstimation from "./deliveryTimeEstimation.ts";

export default class AllCarts {
    carts: Cart[];
    createdAt?: string;
    submittedAt?: string;
    deliveredAt?: string;
    deliveryTimeEstimation?: DeliveryTimeEstimation;

    constructor(carts: Cart[], createdAt?: string, submittedAt?: string, deliveredAt?: string, deliveryTimeEstimation?: DeliveryTimeEstimation) {
        this.carts = carts;
        this.createdAt = createdAt;
        this.submittedAt = submittedAt;
        this.deliveredAt = deliveredAt;
        this.deliveryTimeEstimation = deliveryTimeEstimation;
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

    public getSubmittedAtDate(): Date | undefined {
        if (this.submittedAt == undefined) {
            return undefined
        }
        return new Date(this.submittedAt);
    }

    public getDeliveredAtDate(): Date | undefined {
        if (this.deliveredAt == undefined) {
            return undefined
        }
        return new Date(this.deliveredAt);
    }

    public isSubmitted(): boolean {
        return this.submittedAt != undefined;
    }

    public isDelivered(): boolean {
        return this.deliveredAt != undefined;
    }
}