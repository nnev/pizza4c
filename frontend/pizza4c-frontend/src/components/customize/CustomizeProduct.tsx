import React from "react";
import {CurrentRestaurantObservable} from "../../backend/restaurant.ts";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import Product from "../../datamodel/restaurant/product.ts";
import {ProductInfoView} from "../order/ProductInfo.tsx";
import {Navigate, useParams} from "react-router-dom";
import {PixmapButton} from "../Pixmap.tsx";
import {joinClasses} from "../../util/JoinClasses.ts";


interface CustomizeProps {
    productId: string;
}

interface CustomizeState {
    restaurant?: Restaurant;
    product?: Product;
    selectedVariantId?: string;
    backToOrder: boolean;
}

class CustomizeClazz extends React.Component<CustomizeProps, CustomizeState> {
    constructor(props: CustomizeProps, context: any) {
        super(props, context);
        this.state = {
            backToOrder: false
        }
    }

    listener = (value: Restaurant) => {
        let product = value.menu.products[this.props.productId];

        this.setState({
            restaurant: value,
            product: product,
        });
        if (this.state.selectedVariantId == undefined && product.variants.length == 1) {
            this.setState({selectedVariantId: product.variants[0].id})
        }
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    backToOrder = () => {
        this.setState({backToOrder: true});
    }

    render() {
        if (this.state.product == undefined || this.state.restaurant == undefined) {
            return (<></>)
        }

        if (this.state.backToOrder) {
            return <Navigate to={"/order"}/>;
        }

        if (this.state.selectedVariantId != undefined) {
            return <Navigate
                to={"/customize/" + this.props.productId + "/" + this.state.selectedVariantId}
                replace={this.state.product.variants.length === 1}
            />;
        }

        return (
            <main className="customize notSide">
                <h1>{this.state.product.name}</h1>
                <ProductInfoView productInfo={this.state.product.productInfo}/>
                <div className="customizeButtons">
                    {
                        this.state.product.variants.map((variant, index) => {
                            return <>
                                <PixmapButton
                                    onClick={() => this.setState({selectedVariantId: variant.id})}
                                    pixmap="add"
                                    text={
                                        <>
                                            {variant.name &&
                                                <>
                                                    <span>{variant.name}</span>
                                                    <br/>
                                                </>
                                            }
                                            Preis ohne Extras: <b>{variant.prices.deliveryEuro}€</b>
                                        </>
                                    }
                                    className={joinClasses("", index == 0 ? "primary" : "")}
                                />
                            </>
                        })
                    }
                </div>
                <PixmapButton onClick={this.backToOrder} pixmap="arrow_back" text="Back to product selection"/>
            </main>
        );
    }
}

export const CustomizeProduct = () => {
    let props = useParams();
    return <CustomizeClazz productId={props.productId || "määh"}/>
}