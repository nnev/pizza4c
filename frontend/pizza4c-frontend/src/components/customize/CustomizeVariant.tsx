import Variant from "../../datamodel/restaurant/variant";
import Restaurant from "../../datamodel/restaurant/restaurant";
import React from "react";
import {CustomizeOptionGroup} from "./CustomizeOptionGroup";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import Product from "../../datamodel/restaurant/product";
import {WrapComponent} from "../RouterWrapper";
import {PixmapButton, PixmapGroup} from "../Pixmap";
import {Navigate} from "react-router-dom";
import {addToCart} from "../../backend/Cart";

interface CustomizeVariantProps {
    productId: string;
    variantId: string;
}

interface CustomizeVariantState {
    selectedOptions: Map<string, Set<string>>;
    restaurant?: Restaurant;
    product?: Product;
    variant?: Variant;
    backToVariantSelection: boolean
    backToOrder: boolean
    addToCartCompleted: boolean
}

class CustomizeVariantClazz extends React.Component<CustomizeVariantProps, CustomizeVariantState> {
    constructor(props: CustomizeVariantProps, context: any) {
        super(props, context);
        this.state = {
            selectedOptions: new Map<string, Set<string>>(),
            backToVariantSelection: false,
            backToOrder: false,
            addToCartCompleted: false
        };
    }

    listener = (value: Restaurant) => {
        let product = value.menu.products[this.props.productId];
        let variant = product.variants.find(value => value.id == this.props.variantId);
        this.setState({
            restaurant: value,
            product: product,
            variant: variant,
        });
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    addToCart = () => {
        if (this.props.productId && this.state.variant && this.getCustomizationCompleted()) {
            addToCart(this.props.productId, this.state.variant.id, this.state.selectedOptions)
                .then(value => {
                    this.setState({addToCartCompleted: true});
                })
                .catch(value => {
                    console.error("Error", value); // TODO
                })
        }
    }

    private getCustomizationCompleted(): boolean {
        let variant = this.state.variant;
        let selectedOptionsGroups = this.state.selectedOptions;
        if (variant == undefined) {
            return false;
        } else {
            for (const optionGroupId of variant.optionGroupIds) {
                let optionGroup = this.state.restaurant!.menu.optionGroups[optionGroupId];
                let selectedOptions = selectedOptionsGroups == undefined ? new Set<string> : selectedOptionsGroups!.get(optionGroupId);
                let numSelected = selectedOptions ? selectedOptions.size : 0;
                if (numSelected < optionGroup.minChoices || numSelected > optionGroup.maxChoices) {
                    return false;
                }
            }
        }

        return true;
    }

    backToVariantSelection = () => {
        this.setState({backToVariantSelection: true});
    }
    backToOrder = () => {
        this.setState({backToOrder: true});
    }

    private getTotalPrice(): number {
        let total = 0;
        if (this.state.product && this.state.variant) {
            total += this.state.product.variants.find(value => value.id === this.state.variant!.id)!.prices.delivery;
            for (let options of this.state.selectedOptions.values()) {
                options.forEach(optionId => {
                    let option = this.state.restaurant!.menu.options[optionId];
                    total += option.prices.delivery;
                })
            }
        }
        return total / 100;
    }

    render() {
        if (this.state.backToVariantSelection) {
            return <Navigate to={"/customize/" + this.props.productId}/>;
        }
        if (this.state.backToOrder) {
            return <Navigate to={"/order"}/>;
        }
        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>;
        }
        if (this.state.restaurant == undefined || this.state.product == undefined || this.state.variant == undefined) {
            return <></>;
        }

        return (
            <div className="customize">
                <h1>{this.state.product.name} {this.state.variant ? this.state.variant!.name : ""}</h1>
                Preis ohne Extras: <span>{this.state.variant!.prices.deliveryEuro}</span>€<br/>
                <div className="variantContent">
                    <ul>
                        {
                            this.state.variant!.optionGroupIds.map(value => <CustomizeOptionGroup
                                    key={value}
                                    restaurant={this.state.restaurant!}
                                    productId={this.props.productId}
                                    variant={this.state.variant!}
                                    optionGroupId={value}
                                    onOptionSelected={this.selectOption}
                                />
                            )
                        }
                    </ul>
                </div>

                <b>Total</b>: {this.getTotalPrice().toFixed(2)}€
                <PixmapGroup>
                    <PixmapButton onClick={this.backToOrder} pixmap="arrow_back" text="Back to product selection"/>
                    {this.state.product.variants.length != 1 &&
                        <PixmapButton onClick={this.backToVariantSelection} pixmap="arrow_back"
                                      text="Back to variant selection"/>
                    }

                    <PixmapButton
                        onClick={this.addToCart}
                        pixmap="add"
                        text="Add To Cart"
                        disabled={!this.getCustomizationCompleted()}
                        className="primary"
                    />
                </PixmapGroup>
            </div>
        );
    }

    selectOption = (optionGroupId: string, selectedOptions: Set<string>) => {
        let selectedOptionsSet = this.state.selectedOptions;
        selectedOptionsSet.set(optionGroupId, selectedOptions)
        this.setState({selectedOptions: selectedOptionsSet})
    };
}

export const CustomizeVariant = WrapComponent(CustomizeVariantClazz);