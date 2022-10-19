import Variant from "./variant";
import ProductInfo from "./productInfo";

export default interface Product {
    name: string;
    description: string[];
    imageUrl: string;
    variants: Variant[];
    productInfo: ProductInfo;
}