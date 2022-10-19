import Variant from "../../datamodel/restaurant/variant";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CustomizeVariant, VariantOptionSelectedCallback} from "./CustomizeVariant";
import {CustomizeVariantSelector, VariantSelectedCallback} from "./CustomizeVariantSelector";
import React from "react";

interface CustomizeVariantContainerProps {
    productId: string;
    variants: Variant[];
    restaurant: Restaurant;
    onOptionSelected: VariantOptionSelectedCallback;
    onVariantSelected: VariantSelectedCallback;
}

interface CustomizeVariantContainerState {
}

export class CustomizeVariantContainer extends React.Component<CustomizeVariantContainerProps, CustomizeVariantContainerState> {
    constructor(props: CustomizeVariantContainerProps, context: any) {
        super(props, context);
        this.state = {};
        if (this.props.variants.length == 1) {
            this.selectVariant(this.props.variants[0].id);
        }
    }

    selectVariant = (variantId: string) => {
        this.props.onVariantSelected(variantId);
    }

    render() {
        if (this.props.variants.length > 1) {
            return <CustomizeVariantSelector
                restaurant={this.props.restaurant}
                productId={this.props.productId}
                variants={this.props.variants}
                onOptionSelected={this.props.onOptionSelected}
                onVariantSelected={this.selectVariant}
            />
        } else {
            return <CustomizeVariant
                restaurant={this.props.restaurant}
                variant={this.props.variants[0]}
                productId={this.props.productId}
                onOptionSelected={this.props.onOptionSelected}
            />
        }
    }
}