import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {SelectedOptionCallback} from "./RadioOptionGroup.tsx";
import React, {ChangeEvent} from "react";

interface CheckboxOptionGroupProps {
    productId: string;
    variantId: string;
    optionGroupId: string;
    optionIds: string[]
    restaurant: Restaurant;
    onOptionSelected: SelectedOptionCallback;
}

interface CheckboxOptionGroupState {
    selectedOptions: Set<string>
}

export class CheckboxOptionGroup extends React.Component<CheckboxOptionGroupProps, CheckboxOptionGroupState> {
    constructor(props: CheckboxOptionGroupProps, context: any) {
        super(props, context);
        this.state = {
            selectedOptions: new Set<string>()
        };
    }

    onChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        let value = ev.target.value;
        let options = this.state.selectedOptions;
        if (ev.target.checked) {
            options.add(value);
        } else {
            options.delete(value);
        }
        this.setState({selectedOptions: options})
        this.props.onOptionSelected(this.props.optionGroupId, options);
    }

    render() {
        let name = this.props.productId + '-' + this.props.variantId + '-' + this.props.optionGroupId;
        let options = this.props.optionIds.map(optionId => {
            let option = this.props.restaurant.menu.options[optionId];
            let id = name + '-' + optionId;

            return (
                <div key={optionId} className="option">
                    <div className="optionCheckbox">
                        <input
                            type="checkbox"
                            name={id}
                            id={id}
                            value={optionId}
                        />
                    </div>
                    <div className="optionPrice">
                        <label htmlFor={id}>{"+" + option.prices.deliveryEuro + '€'}</label>
                    </div>
                    <div className="optionName">
                        <label htmlFor={id}>{option.name}</label>
                    </div>
                </div>
            );
        });

        return (
            <div className="optionsContainer" onChange={this.onChangeHandler}>{options}</div>
        );
    }
}