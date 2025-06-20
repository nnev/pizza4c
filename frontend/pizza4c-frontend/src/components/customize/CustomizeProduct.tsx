import React from "react";
import Restaurant, {CurrentRestaurantObservable} from "../../datamodel/restaurant/restaurant.ts";
import {Navigate, useParams} from "react-router-dom";
import {PixmapButton, PixmapGroup, PixmapLink} from "../Pixmap.tsx";
import {joinClasses} from "../../util/JoinClasses.ts";
import {MenuItem} from "../../datamodel/restaurant/menu.ts";
import {formatAsEuro} from "../../util/Formatter.ts";


interface CustomizeProps {
    menuItemId: string;
}

interface CustomizeState {
    restaurant?: Restaurant;
    menuItem?: MenuItem;
    selectedVariationId?: string;
}

class CustomizeClazz extends React.Component<CustomizeProps, CustomizeState> {
    constructor(props: CustomizeProps, context: any) {
        super(props, context);
        this.state = {}
    }

    listener = (value: Restaurant) => {
        let menuItem = value.menu.menuItems[this.props.menuItemId];

        this.setState({
            restaurant: value,
            menuItem: menuItem,
        });
        if (this.state.selectedVariationId == undefined && Object.keys(menuItem.variations).length == 1) {
            this.setState({selectedVariationId: Object.keys(menuItem.variations)[0]})
        }
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.listener);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.listener);
    }

    render() {
        if (this.state.menuItem == undefined || this.state.restaurant == undefined) {
            return (<></>)
        }

        if (this.state.selectedVariationId != undefined) {
            return <Navigate
                to={"/customize/" + this.props.menuItemId + "/" + this.state.selectedVariationId}
                replace={Object.keys(this.state.menuItem.variations).length === 1}
            />;
        }

        return (
            <main className="customize notSide">
                <h1>{this.state.menuItem.name}</h1>
                {/*<ProductInfoView productInfo={this.state.menuItem.productInfo}/>*/}
                <div className="customizeButtons">
                    {
                        Object.entries(this.state.menuItem.variations).map(([variationId, variation], index) => {
                            return <>
                                <PixmapButton
                                    onClick={() => this.setState({selectedVariationId: variationId})}
                                    pixmap="add"
                                    text={
                                        <>
                                            {variation.name &&
                                                <>
                                                    <span>{variation.name}</span>
                                                    <br/>
                                                </>
                                            }
                                            Preis ohne Extras: <b>{formatAsEuro(variation.priceCents)}</b>
                                        </>
                                    }
                                    className={joinClasses("", index == 0 ? "primary" : "")}
                                />
                            </>
                        })
                    }
                </div>
                <PixmapGroup>
                    <PixmapLink to="/order" pixmap="arrow_back" text="Zurück zur Produktauswahl"/>
                </PixmapGroup>
            </main>
        );
    }
}

export const CustomizeProduct = () => {
    let props = useParams();
    return <CustomizeClazz menuItemId={props.menuItemId || "määh"}/>
}