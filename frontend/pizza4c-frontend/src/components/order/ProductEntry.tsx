import React from "react";
import {isConfigurableProduct} from "../../datamodel/restaurant/menu.ts";
import {PixmapButton} from "../Pixmap.tsx";
import {ProductInfoView} from "./ProductInfo.tsx";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import Product from "../../datamodel/restaurant/product.ts";
import {Navigate} from "react-router-dom";
import {addToCart as addToCartApi} from "../../backend/Cart.ts";

interface ProductEntryProps {
    restaurant: Restaurant
    productId: string
}

interface ProductEntryState {
    product: Product;
    redirectToCustomize: boolean;
    addToCartCompleted: boolean;
}

export class ProductEntry extends React.Component<ProductEntryProps, ProductEntryState> {
    constructor(props: ProductEntryProps, context: any) {
        super(props, context);
        this.state = {
            product: props.restaurant.menu.products[props.productId]!,
            redirectToCustomize: false,
            addToCartCompleted: false
        }
    }

    private getAddToCartLink() {
        if (isConfigurableProduct(this.props.restaurant.menu, this.state.product)) {
            return <PixmapButton onClick={this.customize} pixmap="add"/>
        } else {
            return <PixmapButton onClick={this.addToCart} pixmap="add"/>
        }
    }

    addToCart = () => {
        if (this.props.productId) {
            addToCartApi(this.props.productId, this.state.product.variants[0].id, new Map<string, Set<string>>())
                .then(_ => {
                    this.setState({addToCartCompleted: true});
                })
                .catch(value => {
                    console.error("Error", value); // TODO
                })
        }
    }

    customize = () => {
        this.setState({redirectToCustomize: true});
    }

    render() {
        if (this.state.redirectToCustomize) {
            return <Navigate to={'/customize/' + this.props.productId}/>
        }

        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>
        }

        return (
            <li className="product" key={this.props.productId}>
                <div className="productMain">
                    <h2>{this.state.product.name}</h2>
                    <ol>
                        {
                            this.state.product.description.map(value => <li key={value}>{value}</li>)
                        }
                    </ol>
                    <ProductInfoView productInfo={this.state.product.productInfo}/>
                </div>
                <div className="productSelect">
                    {this.getAddToCartLink()}
                </div>
                <div className="productPrice">{this.state.product.variants.at(0)!.prices.deliveryEuro + '€'}</div>
            </li>
        );
    }
}