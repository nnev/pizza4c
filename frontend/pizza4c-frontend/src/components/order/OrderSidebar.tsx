import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {useNavigation} from "react-router-dom";
import {WrapComponent} from "../RouterWrapper";

interface OrderSidebarProps {
    restaurant: Restaurant
}

interface OrderSidebarState {
}

export class OrderSidebar extends React.Component<OrderSidebarProps, OrderSidebarState> {
    constructor(props: OrderSidebarProps, context: any) {
        super(props, context);
        this.state = {}
    }

    render() {
        console.log(window.location)
        let selectedId = window.location.hash.substring(1);
        let categoryEntries = this.props.restaurant.menu.categories.map(category => {
            return <li key={category.id}>
                <h1
                    className={category.id === selectedId ? "target" : ""}
                >
                    <a
                        href={'#' + category.id}
                        title={category.description.join(",")}
                    >{category.name}</a>
                </h1>
            </li>
        });

        return (
            <aside>
                <nav>
                    <ol>
                        {categoryEntries}
                    </ol>
                </nav>
            </aside>
        );
    }
}
