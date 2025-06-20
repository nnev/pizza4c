import Dictionary from "../../util/Dictionary.ts";
import {selectableVegan} from "../cart/vegan.ts";


export interface Menu {
    categories: Dictionary<Category>;
    menuItems: Dictionary<MenuItem>;
}

export type Category = string[];

export interface MenuItem {
    name: string;
    description: string;
    variations: Dictionary<Variation>;
    isVegetarian: boolean;
    isVegan: boolean;
}

export interface Variation {
    name: string;
    priceCents: number;
    modifierGroups: Dictionary<ModifierGroup>;
}

export interface ModifierGroup {
    name: string;
    minAmount: number;
    maxAmount: number;
    modifiers: Dictionary<Modifier>;
}

export interface Modifier {
    name: string;
    priceCents: number;
    minAmount: number;
    maxAmount: number;
    defaultChoices: number;
}

export function isConfigurableProduct(menuItem: MenuItem): boolean {
    if (Object.keys(menuItem.variations).length > 1) {
        return true;
    }

    for (let variant of Object.values(menuItem.variations)) {
        for (let optionGroup of Object.values(variant.modifierGroups)) {
            if (optionGroup != null && isConfigurableModifierGroup(optionGroup)) {
                return true;
            }
        }
    }
    return false;
}

export function isConfigurableModifierGroup(modifierGroup: ModifierGroup): boolean {
    return Object.keys(modifierGroup.modifiers).length > 0;
}

export function getVariation(menu: Menu, menuItemId: string, variationId: string): Variation | undefined {
    if (menu == undefined || menuItemId == undefined || variationId == undefined) {
        return undefined;
    }

    return menu.menuItems[menuItemId].variations[variationId];
}

export function isOptionGroupMandatory(modifierGroup: ModifierGroup): boolean {
    return modifierGroup.minAmount === 1 && modifierGroup.maxAmount === 1;
}

export function isVeganStateProduct(menuItem: MenuItem, veganState: selectableVegan): boolean {
    switch (veganState) {
        case "all":
            return true;
        case "vegetarian":
            return menuItem.isVegetarian;
        case "vegan":
            return menuItem.isVegan;
    }
}

export function isVeganStateCategory(menu: Menu, category: Category, veganState: selectableVegan): boolean {
    return category.find((item) => isVeganStateProduct(menu.menuItems[item], veganState)) !== undefined;
}