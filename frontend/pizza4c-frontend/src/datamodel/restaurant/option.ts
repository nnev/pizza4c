import Prices from "./prices.ts";

export default interface Option {
    name: string;
    minAmount: Number;
    maxAmount: Number;
    prices: Prices;
    isVegetarian: boolean;
    isVegan: boolean;
}