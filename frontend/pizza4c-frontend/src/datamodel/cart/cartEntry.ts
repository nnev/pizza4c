import Dictionary from "../../util/Dictionary.ts";
import {getVariant, Menu} from "../restaurant/menu.ts";

export default class CartEntry {
    id: string;
    product: string;
    variant: string;
    options: Dictionary<string[]>

    comment?: string;

    constructor(id: string, product: string, variant: string, options: Dictionary<string[]>, comment?: string) {
        this.id = id;
        this.product = product;
        this.variant = variant;
        this.options = options;
        this.comment = comment;
    }

    public getPrice(menu: Menu): number {
        let total = 0;
        let variant = getVariant(menu, this.product, this.variant);
        if (variant != undefined) {
            total += variant!.prices.delivery;
            let selectedOptions = this.options;
            if (selectedOptions != undefined) {
                for (let optionKey in selectedOptions) {
                    let options = selectedOptions[optionKey];
                    options.forEach(optionId => total += menu.options[optionId].prices.delivery)
                }
            }
        }
        return total / 100;
    }
}