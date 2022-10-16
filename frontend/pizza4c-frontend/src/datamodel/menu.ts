import Category from "./category";
import {isConfigurableOptionGroup, OptionGroup} from "./optionGroup";
import Option from "./option";
import Product from "./product";

interface Dictionary<T = any> {
    [key: string]: T;
}

export interface Menu {
    categories: Category[];
    optionGroups: Dictionary<OptionGroup>;
    options: Map<string, Option>;
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