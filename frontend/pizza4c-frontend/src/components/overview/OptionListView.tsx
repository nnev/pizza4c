import CartEntry from "../../datamodel/cart/cartEntry.ts";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import React from "react";
import {getVariant} from "../../datamodel/restaurant/menu.ts";

interface OptionListViewProps {
    entry: CartEntry;
    restaurant: Restaurant;
    withSize?: boolean;
}

interface OptionListViewState {
}

export class OptionListView extends React.Component<OptionListViewProps, OptionListViewState> {
    render() {
        let menu = this.props.restaurant.menu;
        let options = this.props.entry.options;
        let mappedOptions: JSX.Element[] = []
        for (let optionGroupKey in options) {
            let optionIds = options[optionGroupKey];
            for (let optionId of optionIds) {
                let option = menu.options[optionId];
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

        let sizeValue = getVariant(this.props.restaurant.menu, this.props.entry.product, this.props.entry.variant)?.name || "";

        return (
            <>
                {menu.products[this.props.entry.product] != undefined && menu.products[this.props.entry.product].name}
                {this.props.withSize == true && sizeValue && " (" + sizeValue + ")"}
                <br/>
                {mappedOptions}
            </>
        )
    }
}