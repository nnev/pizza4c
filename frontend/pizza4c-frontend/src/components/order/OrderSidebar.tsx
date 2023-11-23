import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {selectableVegan, VeganObservable} from "../../datamodel/cart/vegan.ts";
import {Pixmap} from "../Pixmap.tsx";
import {Navigate} from "react-router-dom";
import {getFavorites} from "../../datamodel/favorites.ts";

interface OrderSidebarProps {
    restaurant: Restaurant
}

interface OrderSidebarState {
    selectedId: string;
    vegan: selectableVegan
    redirectToFavorites: boolean
    redirectToRandom: boolean
}

export class OrderSidebar extends React.Component<OrderSidebarProps, OrderSidebarState> {
    constructor(props: OrderSidebarProps, context: any) {
        super(props, context);
        this.state = {
            selectedId: window.location.hash.substring(1),
            vegan: VeganObservable.getValue(),
            redirectToFavorites: false,
            redirectToRandom: false,
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

    setVeganFilter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        VeganObservable.setValue(VeganObservable.getValue() === "vegan" ? "all" : "vegan")
    }

    setVegetarianFilter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        VeganObservable.setValue(VeganObservable.getValue() === "vegetarian" ? "all" : "vegetarian")
    }

    setAllFilter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        VeganObservable.setValue("all")
    }
    redirectFavorites = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        this.setState({redirectToFavorites: true})
    }

    redirectRandom = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        this.setState({redirectToRandom: true})
    }

    setSelectedId(id: string) {
        this.setState({selectedId: id})
        window.location.hash = id
    }

    selSelectedId = (id: string) => {
        return (ev: React.MouseEvent<HTMLAnchorElement>) => {
            ev.preventDefault();
            this.setSelectedId(id)
        }
    }

    render() {
        if (this.state.redirectToFavorites) {
            return <Navigate to="/favorites"/>
        }
        if (this.state.redirectToRandom) {
            return <Navigate to="/random"/>
        }
        let categoryEntries = this.props.restaurant.menu.categories.map(category => {
            return <li key={category.id}>
                <a
                    title={category.description.join(",")}
                    onClick={this.selSelectedId(category.id)}
                >
                    <h1
                        className={category.id === this.state.selectedId ? "target" : ""}
                    >
                        {category.name}
                    </h1>
                </a>
            </li>
        });

        return (
            <aside>
                <nav>
                    <ol>
                        {categoryEntries}
                        <hr/>
                        <li key="alle">
                            <a
                                onClick={this.setAllFilter}
                            >
                                <h1
                                    className={this.state.vegan == "all" ? "target" : ""}
                                >
                                    <Pixmap pixmap="egg_alt" text="Alles"/>
                                </h1>
                            </a>
                        </li>
                        <li key="vegetarisch">
                            <a
                                onClick={this.setVegetarianFilter}
                            >
                                <h1
                                    className={this.state.vegan == "vegetarian" ? "target" : ""}
                                >
                                    <Pixmap pixmap="egg" text="Vegetarisch"/>
                                </h1>
                            </a>
                        </li>
                        <li key="vegan">
                            <a
                                onClick={this.setVeganFilter}
                                title="Leider wird diese Information nicht von Lieferando zur Verfügung gestellt.
Wir versuchen mittels Heuristiken zu erkennen ob es ich um ein veganes Essen handeln könnte.
Es gibt leider keine Garantie für nichts :/"
                            >
                                <h1
                                    className={this.state.vegan == "vegan" ? "target" : ""}
                                >
                                    <Pixmap pixmap="spa" text={"~Vegan-ish?"}/>
                                </h1>
                            </a>
                        </li>
                        {getFavorites().favorite.length > 0 &&
                            <li key="favorites">
                                <a
                                    onClick={this.redirectFavorites}
                                >
                                    <h1
                                        className="favorites"
                                    >
                                        <Pixmap pixmap="favorite" text="Favoriten"/>
                                    </h1>
                                </a>
                            </li>
                        }
                        {
                            <li key="random">
                                <a
                                    onClick={this.redirectRandom}
                                    title="Empire empfiehlt"
                                >
                                    <h1
                                        className="random"
                                    >
                                        <Pixmap pixmap="casino" text="Zufall"/>
                                    </h1>
                                </a>
                            </li>
                        }
                    </ol>
                </nav>
            </aside>
        );
    }
}
