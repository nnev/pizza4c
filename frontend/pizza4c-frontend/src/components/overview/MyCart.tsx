import React, {MouseEvent} from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import {AllCartsObservable, MyCartObservable} from "../../backend/Cart";
import Cart from "../../datamodel/cart/cart";
import {Pixmap, PixmapButton, PixmapGroup} from "../Pixmap";
import {Navigate} from "react-router-dom";
import {ToggleCartPaid} from "./ToggleCartPaid";
import {OptionListView} from "./OptionListView";


interface MyCartProps {
}

interface MyCartState {
    restaurant?: Restaurant
    myCart?: Cart
    redirectLogout: boolean;
    redirectOrder: boolean;
}

export class MyCart extends React.Component<MyCartProps, MyCartState> {
    constructor(props: MyCartProps, context: any) {
        super(props, context);
        this.state = {redirectLogout: false, redirectOrder: false}
    }

    restaurantObserver = (value: Restaurant) => {
        this.setState({restaurant: value});
    }

    myCartObserver = (cart: Cart) => {
        this.setState({myCart: cart});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.restaurantObserver);
        MyCartObservable.subscribe(this.myCartObserver);
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.restaurantObserver);
        MyCartObservable.unsubscribe(this.myCartObserver);
    }

    logout = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        this.setState({redirectLogout: true});
    }

    order = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        this.setState({redirectOrder: true});
    }

    render() {
        if (this.state.redirectLogout) {
            return <Navigate to="/changeName"/>
        }
        if (this.state.redirectOrder) {
            return <Navigate to="/order"/>
        }

        if (!this.state.myCart || !this.state.restaurant) {
            return <></>
        }

        if (this.state.myCart.entries.length == 0) {
            return (<>
                    <h1>Noch keine Bestellung, {this.state.myCart.name}</h1>
                    <PixmapGroup>
                        <PixmapButton onClick={this.order}
                                      pixmap="add"
                                      text="Neue Bestellung"
                                      className="primary"
                                      disabled={AllCartsObservable.getValue().submittedAt > 0}
                        />
                        <PixmapButton onClick={this.logout}
                                      pixmap="logout"
                                      text={'Ich bin nicht ' + this.state.myCart.name}/><br/>
                    </PixmapGroup>
                </>
            );
        }

        return (
            <>
                <h1>Deine Bestellung, {this.state.myCart!.name}</h1>
                <PixmapGroup>
                    <ToggleCartPaid
                        cart={this.state.myCart!}
                    />
                    <PixmapButton onClick={this.order}
                                  pixmap="add"
                                  text="Neue Bestellung"
                                  className="primary"
                                  disabled={AllCartsObservable.getValue().submittedAt > 0}
                    />
                    <PixmapButton onClick={this.logout} pixmap="logout"
                                  text={'Ich bin nicht ' + this.state.myCart.name}/><br/>
                </PixmapGroup>
                <br/>
                <div className="myOrder">
                    <p>
                        <Pixmap
                            pixmap={this.state.myCart.payed ? "done" : "close"}
                            text={this.state.myCart.payed ? "Du hast schon bezahlt" : "Du musst noch bezahlen"}
                            className={this.state.myCart.getPaymentClass()}
                        /> <br/>
                        {this.state.myCart.getPrice(this.state.restaurant.menu).toFixed(2)} €
                    </p>
                    <p>
                        {
                            this.state.myCart.entries.map(entry =>
                                <OptionListView
                                    key={entry.id}
                                    entry={entry}
                                    restaurant={this.state.restaurant!}
                                />)
                        }
                    </p>
                </div>
            </>
        )
    }
}