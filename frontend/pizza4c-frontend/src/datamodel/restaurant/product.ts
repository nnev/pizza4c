import Variant from "./variant.ts";
import ProductInfo from "./productInfo.ts";
import {selectableVegan} from "../cart/vegan.ts";

export default interface Product {
    name: string;
    description: string[];
    imageUrl: string;
    variants: Variant[];
    productInfo: ProductInfo;
    isVegetarian: boolean;
    isVegan: boolean;
}

export function isVeganStateProduct(product: Product, veganState: selectableVegan): boolean {
    switch (veganState){
        case "all":
            return true;
        case "vegetarian":
            return product.isVegetarian;
        case "vegan":
            return product.isVegan;
    }
}