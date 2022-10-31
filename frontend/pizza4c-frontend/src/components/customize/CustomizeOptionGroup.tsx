import Variant from "../../datamodel/restaurant/variant";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {RadioOptionGroup, SelectedOptionCallback} from "./RadioOptionGroup";
import {isOptionGroupMandatory, OptionGroup} from "../../datamodel/restaurant/optionGroup";
import React from "react";
import {CheckboxOptionGroup} from "./CheckboxOptionGroup";

interface CustomizeOptionGroupProps {
    productId: string;
    variant: Variant;
    optionGroupId: string;
    restaurant: Restaurant;
    onOptionSelected: SelectedOptionCallback;
}

interface CustomizeOptionGroupState {
    optionGroup: OptionGroup;
}

export class CustomizeOptionGroup extends React.Component<CustomizeOptionGroupProps, CustomizeOptionGroupState> {
    constructor(props: CustomizeOptionGroupProps, context: any) {
        super(props, context);
        this.state = {optionGroup: this.props.restaurant.menu.optionGroups[this.props.optionGroupId]};
    }

    render() {
        return (
            <li>
                <fieldset>
                    <h2>{this.state.optionGroup.name}{isOptionGroupMandatory(this.state.optionGroup) && "*"}</h2>
                    {
                        isOptionGroupMandatory(this.state.optionGroup) ? <RadioOptionGroup
                            productId={this.props.productId}
                            variantId={this.props.variant.id}
                            optionGroupId={this.props.optionGroupId}
                            restaurant={this.props.restaurant}
                            optionIds={this.state.optionGroup.optionIds}
                            onOptionSelected={this.props.onOptionSelected}
                        /> : <CheckboxOptionGroup
                            productId={this.props.productId}
                            variantId={this.props.variant.id}
                            optionGroupId={this.props.optionGroupId}
                            restaurant={this.props.restaurant}
                            optionIds={this.state.optionGroup.optionIds}
                            onOptionSelected={this.props.onOptionSelected}
                        />
                    }
                </fieldset>
            </li>
        );
    }
}