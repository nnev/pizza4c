import React from "react";
import Restaurant from "../../datamodel/restaurant";

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
        let categoryEntries = this.props.restaurant.menu.categories.map(category => {
            return <li key={category.id}>
                <h1>
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