import Variant from "../../datamodel/restaurant/variant";
import Restaurant from "../../datamodel/restaurant/restaurant";
import React from "react";
import {CustomizeOptionGroup} from "./CustomizeOptionGroup";

export interface VariantOptionSelectedCallback {
    (variantId: string, options: Map<string, Set<string>>): void;
}

interface CustomizeVariantProps {
    productId: string;
    variant: Variant;
    restaurant: Restaurant;
    onOptionSelected: VariantOptionSelectedCallback;
}

interface CustomizeVariantState {
    selectedOptions: Map<string, Set<string>>;
}

export class CustomizeVariant extends React.Component<CustomizeVariantProps, CustomizeVariantState> {
    constructor(props: CustomizeVariantProps, context: any) {
        super(props, context);
        this.state = {selectedOptions: new Map<string, Set<string>>()};
    }

    render() {
        return (
            <>
                <label
                    className="variantTitle"
                    htmlFor={this.props.productId + '-' + this.props.variant.id}
                >
                    {this.props.variant.name &&
                        <>
                            <span>{this.props.variant.name}</span>,&nbsp;
                        </>
                    }
                    Price: <span>{this.props.variant.prices.deliveryEuro}</span>€<br/>
                </label>
                <div className="variantContent">
                    <ul>
                        {
                            this.props.variant.optionGroupIds.map(value => <CustomizeOptionGroup
                                    key={value}
                                    restaurant={this.props.restaurant}
                                    productId={this.props.productId}
                                    variant={this.props.variant}
                                    optionGroupId={value}
                                    onOptionSelected={this.selectOption}
                                />
                            )
                        }
                    </ul>
                </div>
            </>
        );
    }

    selectOption = (optionGroupId: string, selectedOptions: Set<string>) => {
        let selectedOptionsSet = this.state.selectedOptions;
        selectedOptionsSet.set(optionGroupId, selectedOptions)
        this.setState({selectedOptions: selectedOptionsSet})
        this.props.onOptionSelected(this.props.variant.id, selectedOptionsSet)
    };
}