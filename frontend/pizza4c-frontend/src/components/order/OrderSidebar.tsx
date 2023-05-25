import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";

interface OrderSidebarProps {
    restaurant: Restaurant
}

interface OrderSidebarState {
    selectedId: string;
    selectedVegan: string;
}

export class OrderSidebar extends React.Component<OrderSidebarProps, OrderSidebarState> {
    constructor(props: OrderSidebarProps, context: any) {
        super(props, context);
        this.state = {
            selectedId: window.location.hash.substring(1),
            selectedVegan: "all"
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
                        <li key="vegetarisch">
                            <h1>
                                <a
                                    href={"#vegetarisch"}
                                    onClick={() => this.setState({selectedId: "vegetarisch"})}
                                >Vegetarisch</a>
                            </h1>
                        </li>
                        <li key="vegan">
                            <h1>
                                <a
                                    href={"#vegan"}
                                    onClick={() => this.setState({selectedId: "vegan"})}
                                >Vegan</a>
                            </h1>
                        </li>
                    </ol>
                </nav>
            </aside>
        );
    }
}
