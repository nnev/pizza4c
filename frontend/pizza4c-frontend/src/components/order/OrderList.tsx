import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CategoryEntry} from "./CategoryEntry";


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