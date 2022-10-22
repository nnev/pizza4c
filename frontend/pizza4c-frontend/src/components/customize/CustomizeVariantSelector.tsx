import React from "react";
import Variant from "../../datamodel/restaurant/variant";
import {CustomizeVariant, VariantOptionSelectedCallback} from "./CustomizeVariant";
import Restaurant from "../../datamodel/restaurant/restaurant";

export interface VariantSelectedCallback {
    (variantId: string): void;
}

interface CustomizeVariantSelectorProps {
    productId: string;
    variants: Variant[];
    restaurant: Restaurant;
    onOptionSelected: VariantOptionSelectedCallback;
    onVariantSelected: VariantSelectedCallback;
}

interface CustomizeVariantSelectorState {
}

export class CustomizeVariantSelector extends React.Component<CustomizeVariantSelectorProps, CustomizeVariantSelectorState> {
    constructor(props: CustomizeVariantSelectorProps, context: any) {
        super(props, context);
        this.state = {};
    }

    variantSelectionChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.name === "variantId") {
            this.props.onVariantSelected(ev.target.value);
        }
    }

    private getSelector(variant: Variant) {
        return (
            <li key={variant.id} className="variant">
                <input
                    className="variantSelect"
                    type="radio"
                    name="variantId"
                    value={variant.id.slice()}
                    id={this.props.productId + '-' + variant.id.slice()}
                    onChange={this.variantSelectionChanged}
                />
                <CustomizeVariant
                    restaurant={this.props.restaurant}
                    productId={this.props.productId}
                    variant={variant}
                    onOptionSelected={this.props.onOptionSelected}
                />
            </li>
        );
    }

    render() {
        return (
            <>
                Variants:
                <ul className="variantContainer">
                    {this.props.variants.map(value => this.getSelector(value))}
                </ul>
            </>
        )
    }
}