import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";

interface OrderSidebarProps {
    restaurant: Restaurant
}

interface OrderSidebarState {
    selectedId: string;
}

export class OrderSidebar extends React.Component<OrderSidebarProps, OrderSidebarState> {
    constructor(props: OrderSidebarProps, context: any) {
        super(props, context);
        this.state = {
            selectedId: window.location.hash.substring(1)
        }
    }

    render() {
        let categoryEntries = this.props.restaurant.menu.categories.map(category => {
            return <li key={category.id}>
                <h1
                    className={category.id === this.state.selectedId ? "target" : ""}
                >
                    <a
                        href={'#' + category.id}
                        title={category.description.join(",")}
                        onClick={() => this.setState({selectedId: category.id})}
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
