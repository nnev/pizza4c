import React from "react";
import {isConfigurableProduct, MenuItem} from "../../datamodel/restaurant/menu.ts";
import {PixmapButton} from "../Pixmap.tsx";
import {Navigate} from "react-router-dom";
import {addToCart as addToCartApi} from "../../backend/Cart.ts";
import {WordBreakHelper} from "./WordBreakHelper.tsx";
import {joinClasses} from "../../util/JoinClasses.ts";
import {selectableVegan} from "../../datamodel/cart/vegan.ts";
import {formatAsEuro} from "../../util/Formatter.ts";

interface ProductEntryProps {
    menuItemId: string;
    menuItem: MenuItem;
    vegan: selectableVegan
}

interface ProductEntryState {
    redirectToCustomize: boolean;
    addToCartCompleted: boolean;
}

export class ProductEntry extends React.Component<ProductEntryProps, ProductEntryState> {
    constructor(props: ProductEntryProps, context: any) {
        super(props, context);
        this.state = {
            redirectToCustomize: false,
            addToCartCompleted: false
        }
    }

    private getAddToCartLink() {
        if (isConfigurableProduct(this.props.menuItem)) {
            return <PixmapButton onClick={this.customize} pixmap="add"/>
        } else {
            return <PixmapButton onClick={this.addToCart} pixmap="add"/>
        }
    }

    addToCart = () => {
        if (this.props.menuItemId) {
            addToCartApi(this.props.menuItemId, Object.keys(this.props.menuItem.variations)[0], new Map<string, Set<string>>())
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
            return <Navigate to={'/customize/' + this.props.menuItemId}/>
        }

        if (this.state.addToCartCompleted) {
            return <Navigate to="/"/>
        }

        let minPrice = Number.MAX_SAFE_INTEGER;
        Object.values(this.props.menuItem.variations).forEach((variation) => {
            if (variation.priceCents < minPrice) {
                minPrice = variation.priceCents;
            }
        })

        return (
            <li className="product" key={this.props.menuItemId}>
                <div
                    className={joinClasses("productMain", this.props.menuItem.isVegan ? "vegan" : this.props.menuItem.isVegetarian ? "vegetarian" : "fleisch")}>
                    <h2><WordBreakHelper text={this.props.menuItem.name}/></h2>
                    <ol>
                        <li>{this.props.menuItem.description}</li>
                    </ol>
                    {/*<ProductInfoView productInfo={this.props.menuItem.productInfo}/>*/}
                </div>
                <div className="productSelect">
                    {this.getAddToCartLink()}
                </div>
                <div className="productPrice">{formatAsEuro(minPrice)}</div>
            </li>
        );
    }
}