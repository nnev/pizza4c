import CartEntry from "../../datamodel/cart/cartEntry";
import Restaurant from "../../datamodel/restaurant/restaurant";
import React from "react";

interface OptionListViewProps {
    entry: CartEntry;
    restaurant: Restaurant;
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

        if(this.props.entry.comment != undefined && this.props.entry.comment != "") {
            mappedOptions.push(
                <span key="comment">
                &nbsp;&nbsp;+&nbsp;{this.props.entry.comment}<br/>
            </span>
            )
        }

        return (
            <>
                {menu.products[this.props.entry.product] != undefined && menu.products[this.props.entry.product].name}
                <br/>
                {mappedOptions}
            </>
        )
    }
}