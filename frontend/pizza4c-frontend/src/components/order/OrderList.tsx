import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {CategoryEntry} from "./CategoryEntry.tsx";
import {selectableVegan, VeganObservable} from "../../datamodel/cart/vegan.ts";
import {isVeganStateCategory} from "../../datamodel/restaurant/category.ts";
import {isVeganStateProduct} from "../../datamodel/restaurant/product.ts";


interface OrderListProps {
    restaurant: Restaurant
}

interface OrderListState {
    vegan: selectableVegan
}

export class OrderList extends React.Component<OrderListProps, OrderListState> {
    constructor(props: OrderListProps, context: any) {
        super(props, context);
        this.state = {
            vegan: "all"
        }
    }

    veganObserver = (vegan: selectableVegan) => {
        this.setState({vegan: vegan})
    }

    componentDidMount() {
        VeganObservable.subscribe(this.veganObserver)
    }

    componentWillUnmount() {
        VeganObservable.unsubscribe(this.veganObserver)
    }

    render() {
        return (
            <ol>
                {
                    this.props
                        .restaurant
                        .menu
                        .categories
                        .filter(value => {
                            if (this.state.vegan == "all") {
                                return true
                            }
                            if (!isVeganStateCategory(value, this.state.vegan)) {
                                return false;
                            }
                            let hasVeganOption = false;
                            for (let productId of value.productIds) {
                                let product = this.props.restaurant.menu.products[productId];
                                hasVeganOption ||= isVeganStateProduct(product, this.state.vegan)
                            }
                            return hasVeganOption
                        })
                        .map(value => <CategoryEntry
                            key={value.id}
                            restaurant={this.props.restaurant}
                            category={value}
                            vegan={this.state.vegan}
                        />)
                }
            </ol>
        );
    }
}