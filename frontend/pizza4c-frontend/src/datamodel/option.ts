import Prices from "./prices";

export default interface Option {
    name: string;
    minAmount: Number;
    maxAmount: Number;
    prices: Prices;
}