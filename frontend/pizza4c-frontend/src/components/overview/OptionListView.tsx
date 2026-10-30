import CartEntry from "../../datamodel/cart/cartEntry.ts";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import React, {JSX} from "react";
import {getVariation, MenuItem, Variation} from "../../datamodel/restaurant/menu.ts";

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
        const menu = this.props.restaurant.menu;
        const modifiers = this.props.entry.modifiers;

        const variation: Variation | undefined = getVariation(menu, this.props.entry.menuItem, this.props.entry.variation);

        const mappedOptions: JSX.Element[] = []
        if (variation !== undefined) {
            for (const optionGroupKey in modifiers) {
                const modifierGroup = variation.modifierGroups[optionGroupKey];
                const modifierIds = modifiers[optionGroupKey];
                for (const modifierId of modifierIds) {
                    const option = modifierGroup.modifiers[modifierId];
                    if (option) {
                        mappedOptions.push(
                            <span key={option.name}>
                            &nbsp;&nbsp;+&nbsp;{option.name}<br/>
                        </span>
                        )
                    }
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

        const sizeValue = variation?.name || "";
        const product: MenuItem | undefined = menu.menuItems[this.props.entry.menuItem];
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