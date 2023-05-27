import {selectableVegan} from "../cart/vegan.ts";

export default interface Category {
    id: string;
    name: string;
    description: string[];
    productIds: string[];
    isVegetarian: boolean;
    isVegan: boolean;
}

export function isVeganStateCategory(category: Category, veganState: selectableVegan): boolean {
    switch (veganState){
        case "all":
            return true;
        case "vegetarian":
            return category.isVegetarian;
        case "vegan":
            return category.isVegan;
    }
}