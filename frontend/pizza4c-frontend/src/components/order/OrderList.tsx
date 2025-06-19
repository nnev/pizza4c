import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {CategoryEntry} from "./CategoryEntry.tsx";
import {selectableVegan, VeganObservable} from "../../datamodel/cart/vegan.ts";
import {isVeganStateCategory} from "../../datamodel/restaurant/menu.ts";


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
                    Object.keys(this.props
                        .restaurant
                        .menu
                        .categories
                    )
                        .filter(value => {
                            const category = this.props.restaurant.menu.categories[value];
                            if (this.state.vegan == "all") {
                                return true
                            }
                            return isVeganStateCategory(this.props.restaurant.menu, category, this.state.vegan);
                        })
                        .map(categoryName => <CategoryEntry
                            key={categoryName}
                            restaurant={this.props.restaurant}
                            categoryName={categoryName}
                            category={this.props.restaurant.menu.categories[categoryName]}
                            vegan={this.state.vegan}
                        />)
                }
            </ol>
        );
    }
}