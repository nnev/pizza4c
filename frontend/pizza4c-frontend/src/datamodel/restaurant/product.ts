import Variant from "./variant.ts";
import ProductInfo from "./productInfo.ts";

export default interface Product {
    name: string;
    description: string[];
    imageUrl: string;
    variants: Variant[];
    productInfo: ProductInfo;
    isVegetarian: boolean;
    isVegan: boolean;
}