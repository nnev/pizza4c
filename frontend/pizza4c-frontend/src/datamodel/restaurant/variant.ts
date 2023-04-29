import Prices from "./prices.ts";

export default interface Variant {
    id: string;
    name: string;
    optionGroupIds: string[];
    shippingTypes: string;
    prices: Prices;
}