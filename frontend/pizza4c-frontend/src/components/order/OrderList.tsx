import React from "react";
import Restaurant from "../../datamodel/restaurant";
import Category from "../../datamodel/category";
import Product from "../../datamodel/product";
import ProductInfo from "../../datamodel/productInfo";
import {PixmapLink} from "../Pixmap";
import {isConfigurableProduct} from "../../datamodel/menu";

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

    private anyProductInformation(productInfo: ProductInfo): boolean {

        let additives = productInfo.additives != null && productInfo.additives.length > 0;
        let allergens = productInfo.allergens != null && productInfo.allergens.length > 0;
        let alcoholVolume = productInfo.alcoholVolume != null && productInfo.alcoholVolume.length > 0;
        let caffeineAmount = productInfo.caffeineAmount != null && productInfo.caffeineAmount.length > 0;
        let nutritionalTextManual = productInfo.nutritionalTextManual != null && productInfo.nutritionalTextManual.length > 0;


        let result = additives ||
            allergens ||
            alcoholVolume ||
            caffeineAmount ||
            nutritionalTextManual;

        if (result) {
            console.log(additives, allergens, alcoholVolume, caffeineAmount, nutritionalTextManual);
        }
        return result;
    }

    private getProductInformation() {
        let productInfo = this.state.product.productInfo;
        if (this.anyProductInformation(productInfo)) {
            return (
                <div>
                    ProductInfo:
                    <ul>
                        <li>Additives: <span>{productInfo.additives}</span></li>
                        <li>Allergens: <span>{productInfo.allergens}</span></li>
                        <li>AlcoholVolume: <span>{productInfo.alcoholVolume}</span></li>
                        <li>CaffeineAmount: <span>{productInfo.caffeineAmount}</span></li>
                        <li>Verified: <span>{productInfo.isFoodInformationVerifiedByRestaurant}</span></li>
                        <li>Manual: <span>{productInfo.nutritionalTextManual}</span></li>
                    </ul>
                </div>
            );
        }

        return <></>
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
                    {this.getProductInformation()}
                </div>
                <div className="productSelect">
                    {this.getAddToCartLink()}
                </div>
                <div className="productPrice">{this.state.product.variants.at(0)!.prices.deliveryEuro + '€'}</div>
            </li>
        );
    }
}

interface CategoryEntryProps {
    restaurant: Restaurant
    category: Category
}

interface CategoryEntryState {
}

export class CategoryEntry extends React.Component<CategoryEntryProps, CategoryEntryState> {
    constructor(props: CategoryEntryProps, context: any) {
        super(props, context);
        this.state = {}
    }

    private getDescription() {
        if (this.props.category.description != null && this.props.category.description.length > 0) {
            return (
                <span className="categoryDescription">{this.props.category.description.join(",")}</span>
            );
        }
        return <></>
    }

    render() {
        return (
            <li className="category">
                <h1 id={this.props.category.id}>{this.props.category.name}</h1>
                {this.getDescription()}
                <ol>
                    {
                        this.props
                            .category
                            .productIds
                            .map(value => <ProductEntry key={value} restaurant={this.props.restaurant}
                                                        productId={value}/>)
                    }
                </ol>
            </li>
        );
    }
}


interface OrderListProps {
    restaurant: Restaurant
}

interface OrderListState {
}

export class OrderList extends React.Component<OrderListProps, OrderListState> {
    constructor(props: OrderListProps, context: any) {
        super(props, context);
        this.state = {}
    }

    render() {
        return (
            <ol>
                {
                    this.props
                        .restaurant
                        .menu
                        .categories
                        .map(value => <CategoryEntry key={value.id} restaurant={this.props.restaurant}
                                                     category={value}/>)
                }
            </ol>
        );
    }
}