import Prices from "./prices.ts";
import {selectableVegan} from "../cart/vegan.ts";

export default interface Option {
    name: string;
    minAmount: Number;
    maxAmount: Number;
    prices: Prices;
    isVegetarian: boolean;
    isVegan: boolean;
}

export function isVeganStateOption(option: Option, veganState: selectableVegan): boolean {
    switch (veganState){
        case "all":
            return true;
        case "vegetarian":
            return option.isVegetarian;
        case "vegan":
            return option.isVegan;
    }
}