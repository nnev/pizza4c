import React from "react";
import {isConfigurableProduct} from "../../datamodel/restaurant/menu";
import {PixmapLink} from "../Pixmap";
import {ProductInfoView} from "./ProductInfo";
import Restaurant from "../../datamodel/restaurant/restaurant";
import Product from "../../datamodel/restaurant/product";

interface ProductEntryProps {
    restaurant: Restaurant
    productId: string
}

interface ProductEntryState {
    product: Product;
}

export class ProductEntry extends React.Component<ProductEntryProps, ProductEntryState> {
    constructor(props: ProductEntryProps, context: any) {
        super(props, context);
        this.state = {product: props.restaurant.menu.products[props.productId]!}
    }

    private getAddToCartLink() {
        if (isConfigurableProduct(this.props.restaurant.menu, this.state.product)) {
            return <PixmapLink to={'/customize/' + this.props.productId} pixmap="tune"/>
        } else {
            return <PixmapLink to={'/addToCart/' + this.props.productId} pixmap="add"/>
        }
    }

    render() {
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