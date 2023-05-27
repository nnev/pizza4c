import React from "react";
import {ProductEntry} from "./ProductEntry.tsx";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import Category from "../../datamodel/restaurant/category.ts";
import {selectableVegan} from "../../datamodel/cart/vegan.ts";
import {isVeganStateProduct} from "../../datamodel/restaurant/product.ts";

interface CategoryEntryProps {
    restaurant: Restaurant
    category: Category
    vegan: selectableVegan
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
                            .filter(value => {
                                return isVeganStateProduct(this.props.restaurant.menu.products[value], this.props.vegan)
                            })
                            .map(value => <ProductEntry
                                key={value}
                                restaurant={this.props.restaurant}
                                productId={value}
                                vegan={this.props.vegan}
                            />)
                    }
                </ol>
            </li>
        );
    }
}