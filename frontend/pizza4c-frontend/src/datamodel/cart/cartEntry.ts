import Dictionary from "../../util/Dictionary.ts";
import {getVariant, Menu} from "../restaurant/menu.ts";

export default class CartEntry {
    id: string;
    menuItem: string;
    variation: string;
    modifiers: Dictionary<string[]>

    comment?: string;

    constructor(id: string, product: string, variant: string, options: Dictionary<string[]>, comment?: string) {
        this.id = id;
        this.menuItem = product;
        this.variation = variant;
        this.modifiers = options;
        this.comment = comment;
    }

    public getPrice(menu: Menu): number {
        let total = 0;
        let variant = getVariant(menu, this.menuItem, this.variation);
        if (variant != undefined) {
            total += variant.priceCents;
            let selectedModifiers = this.modifiers;
            if (selectedModifiers != undefined) {
                for (let modifierGroupId in selectedModifiers) {
                    let modifierGroup = variant.modifierGroups[modifierGroupId];
                    let modifiers = selectedModifiers[modifierGroupId];
                    modifiers.forEach(modifierId => total += modifierGroup.modifiers[modifierId].priceCents)
                }
            }
        }
        return total;
    }
}