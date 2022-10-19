import Restaurant from "../../datamodel/restaurant/restaurant";
import React, {ChangeEvent} from "react";

export interface SelectedOptionCallback {
    (optionGroupId: string, selectedOptions: Set<string>): void;
}

interface RadioOptionGroupProps {
    productId: string;
    variantId: string;
    optionGroupId: string;
    optionIds: string[]
    restaurant: Restaurant;
    onOptionSelected: SelectedOptionCallback;
}

interface RadioOptionGroupState {
}

export class RadioOptionGroup extends React.Component<RadioOptionGroupProps, RadioOptionGroupState> {
    constructor(props: RadioOptionGroupProps, context: any) {
        super(props, context);
        this.state = {};
    }

    onChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        let value = ev.target.value;
        this.props.onOptionSelected(this.props.optionGroupId, new Set<string>([value]));
    }

    render() {
        let name = this.props.productId + '-' + this.props.variantId + '-' + this.props.optionGroupId;
        let options = this.props.optionIds.map(optionId => {
            let option = this.props.restaurant.menu.options[optionId];
            let id = name + '-' + optionId;

            return (
                <div key={optionId} className="option">
                    <div className="optionRadio">
                        <input
                            type="radio"
                            name={name}
                            id={id}
                            value={optionId}
                        />
                    </div>
                    <div className="optionName">
                        <label htmlFor={id}>{option.name}</label>
                    </div>
                    <div className="optionPrice">
                        <label htmlFor={id}>{"+" + option.prices.deliveryEuro + '€'}</label>
                    </div>
                </div>
            );
        });

        return (
            <div className="optionsContainer" onChange={this.onChangeHandler}>{options}</div>
        );
    }
}