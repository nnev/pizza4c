import CartEntry from "../../datamodel/cart/cartEntry.ts";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import React from "react";
import {getVariation} from "../../datamodel/restaurant/menu.ts";

interface OptionListViewProps {
    entry: CartEntry;
    restaurant: Restaurant;
    withSize?: boolean;
    withDescription?: boolean;
}

interface OptionListViewState {
}

export class OptionListView extends React.Component<OptionListViewProps, OptionListViewState> {
    render() {
        let menu = this.props.restaurant.menu;
        let modifiers = this.props.entry.modifiers;

        console.log("++++", this.props.entry.menuItem, this.props.entry.variation);
        console.log("****", menu.menuItems[this.props.entry.menuItem], menu.menuItems[this.props.entry.menuItem].variations);

        let variation = menu.menuItems[this.props.entry.menuItem].variations[this.props.entry.variation];

        let mappedOptions: JSX.Element[] = []
        for (let optionGroupKey in modifiers) {
            let modifierGroup = variation.modifierGroups[optionGroupKey];
            let modifierIds = modifiers[optionGroupKey];
            for (let modifierId of modifierIds) {
                let option = modifierGroup.modifiers[modifierId];
                if (option) {
                    mappedOptions.push(
                        <span key={option.name}>
                            &nbsp;&nbsp;+&nbsp;{option.name}<br/>
                        </span>
                    )
                }
            }
        }

        if (this.props.entry.comment != undefined && this.props.entry.comment != "") {
            mappedOptions.push(
                <span key="comment">
                &nbsp;&nbsp;+&nbsp;{this.props.entry.comment}<br/>
            </span>
            )
        }

        let sizeValue = getVariation(this.props.restaurant.menu, this.props.entry.menuItem, this.props.entry.variation)?.name || "";
        let product = this.props.restaurant.menu.menuItems[this.props.entry.menuItem];
        return (
            <>
                <b>
                    {product != undefined && product.name}
                    {this.props.withSize == true && sizeValue && " (" + sizeValue + ")"}
                </b>
                <br/>
                {this.props.withDescription == true && product.description.length > 0 && <i>
                    {product.description}
                    <br/>
                </i>}
                {mappedOptions}
            </>
        )
    }
}