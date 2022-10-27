import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import {AllCartsObservable} from "../../backend/Cart";
import Cart from "../../datamodel/cart/cart";
import {PixmapButton} from "../Pixmap";
import {renderPdf} from "../../backend/RenderPdf";


interface SubmitProps {
}

interface SubmitState {
    restaurant?: Restaurant
    allCarts?: Cart[],
}

export class SubmitGroupOrder extends React.Component<SubmitProps, SubmitState> {
    constructor(props: SubmitProps, context: any) {
        super(props, context);
        this.state = {}
    }

    restaurantObserver = (value: Restaurant) => {
        this.setState({restaurant: value});
    }

    allCartsObserver = (carts: Cart[]) => {
        this.setState({allCarts: carts});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.restaurantObserver);
        AllCartsObservable.subscribe(this.allCartsObserver);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.restaurantObserver);
        AllCartsObservable.unsubscribe(this.allCartsObserver);
    }

    render() {
        if (!this.state.allCarts || !this.state.restaurant) {
            return <></>
        }

        return (
            <main>
                <PixmapButton onClick={() => renderPdf()} pixmap="render" text="render"/><br/>
            </main>
        )
    }
}