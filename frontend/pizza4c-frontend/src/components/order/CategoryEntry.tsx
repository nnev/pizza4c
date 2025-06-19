import React from "react";
import {ProductEntry} from "./ProductEntry.tsx";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {selectableVegan} from "../../datamodel/cart/vegan.ts";
import {Category, isVeganStateProduct} from "../../datamodel/restaurant/menu.ts";

interface CategoryEntryProps {
    restaurant: Restaurant;
    categoryName: string;
    category: Category;
    vegan: selectableVegan;
}

interface CategoryEntryState {
}

export class CategoryEntry extends React.Component<CategoryEntryProps, CategoryEntryState> {
    constructor(props: CategoryEntryProps, context: any) {
        super(props, context);
        this.state = {}
    }

    private getDescription() {
        // if (this.props.category.description != null && this.props.category.description.length > 0) {
        //     return (
        //         <span className="categoryDescription">{this.props.category.description.join(",")}</span>
        //     );
        // }
        return <></>
    }

    render() {
        return (
            <li className="category">
                <h1 id={this.props.categoryName}>{this.props.categoryName}</h1>
                {this.getDescription()}
                <ol>
                    {
                        this.props
                            .category
                            .filter(menuItemId => {
                                return isVeganStateProduct(this.props.restaurant.menu.menuItems[menuItemId], this.props.vegan)
                            })
                            .map(value => <ProductEntry
                                key={value}
                                menuItemId={value}
                                menuItem={this.props.restaurant.menu.menuItems[value]}
                                vegan={this.props.vegan}
                            />)
                    }
                </ol>
            </li>
        );
    }
}