import React from "react";
import {WrapComponent} from "../RouterWrapper";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import Restaurant from "../../datamodel/restaurant/restaurant";
import Product from "../../datamodel/restaurant/product";
import {ProductInfoView} from "../order/ProductInfo";
import {addToCart as addToCartApi} from "../../backend/Cart";
import {Navigate} from "react-router-dom";
import {CustomizeVariantContainer} from "./CustomizeVariantContainer";


interface CustomizeProps {
    productId: string;
}

interface CustomizeState {
    restaurant?: Restaurant;
    product?: Product;
    selectedVariant?: string;
    selectedOptions: Map<string, Map<string, Set<string>>>;
    addToCartCompleted: boolean;
}

export class CustomizeClazz extends React.Component<CustomizeProps, CustomizeState> {
    constructor(props: CustomizeProps, context: any) {
        super(props, context);
        this.state = {
            selectedOptions: new Map<string, Map<string, Set<string>>>(),
            addToCartCompleted: false
        }
    }

    listener = (value: Restaurant) => {
        this.setState({restaurant: value, product: value.menu.products[this.props.productId]});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    addToCart = () => {
        if (this.props.productId && this.state.selectedVariant) {
            addToCartApi(this.props.productId, this.state.selectedVariant, this.getOptions())
                .then(value => {
                    this.setState({addToCartCompleted: true});
                })
                .catch(value => {
                    console.error("Error", value); // TODO
                })
        }
    }

    private getOptions(): Map<string, Set<string>> {
        if (this.state.product && this.state.selectedVariant) {
            let selectedOptions = this.state.selectedOptions.get(this.state.selectedVariant!);
            if (selectedOptions != undefined) {
                return selectedOptions;
            }
        }
        return new Map<string, Set<string>>();
    }

    private getTotalPrice(): number {
        let total = 0;
        if (this.state.product && this.state.selectedVariant) {
            total += this.state.product.variants.find(value => value.id === this.state.selectedVariant)!.prices.delivery;
            let selectedOptions = this.state.selectedOptions.get(this.state.selectedVariant!);
            if (selectedOptions != undefined) {
                for (let options of selectedOptions.values()) {
                    options.forEach(optionId => total += this.state.restaurant!.menu.options[optionId].prices.delivery)
                }
            }
        }
        return total / 100;
    }

    render() {
        if (this.state.product == undefined) {
            return (<></>)
        }

        if (this.state.addToCartCompleted) {
            return <Navigate to={"/"}/>
        }

        return (
            <div>
                Product: <span>{this.state.product.name}</span> (<span>{this.props.productId}</span>)
                <br/>
                <ProductInfoView productInfo={this.state.product.productInfo}/>
                <CustomizeVariantContainer
                    restaurant={this.state.restaurant!}
                    productId={this.props.productId}
                    variants={this.state.product.variants}
                    onOptionSelected={(variantId, options) => {
                        let selectedOptions = this.state.selectedOptions;
                        selectedOptions.set(variantId, options);
                        this.setState({selectedOptions: selectedOptions});
                    }}
                    onVariantSelected={variantId => {
                        this.setState({selectedVariant: variantId});
                    }}
                />
                Total: {this.getTotalPrice().toFixed(2)}€
                <br/>
                <input type="submit" onClick={this.addToCart}/>
            </div>
        );
    }
}

export const Customize = WrapComponent(CustomizeClazz);