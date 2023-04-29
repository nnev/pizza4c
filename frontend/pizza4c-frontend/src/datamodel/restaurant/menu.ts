import Category from "./category.ts";
import {isConfigurableOptionGroup, OptionGroup} from "./optionGroup.ts";
import Option from "./option.ts";
import Product from "./product.ts";
import Dictionary from "../../util/Dictionary.ts";
import Variant from "./variant.ts";


export interface Menu {
    categories: Category[];
    optionGroups: Dictionary<OptionGroup>;
    options: Dictionary<Option>;
    products: Dictionary<Product>;
}

export function isConfigurableProduct(menu: Menu, product: Product): boolean {
    if (product.variants.length > 1) {
        return true;
    }

    for (let variant of product.variants) {
        for (let optionGroupId of variant.optionGroupIds) {
            let optionGroup = menu.optionGroups[optionGroupId];
            if (optionGroup != null && isConfigurableOptionGroup(optionGroup)) {
                return true;
            }
        }
    }
    return false;
}

export function getVariant(menu: Menu, productId: string, variantId: string): Variant | undefined {
    if(menu == undefined || productId == undefined || variantId == undefined){
        return undefined;
    }

    let product = menu.products[productId];
    if(product == undefined){
        return undefined;
    }
    return product.variants.find(value => value.id == variantId);
}