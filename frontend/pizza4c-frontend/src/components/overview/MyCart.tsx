import React, {MouseEvent} from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {AllCartsObservable} from "../../backend/Cart";
import {Pixmap, PixmapButton, PixmapGroup} from "../Pixmap";
import {Navigate} from "react-router-dom";
import {ToggleCartPaid} from "./ToggleCartPaid";
import {OptionListView} from "./OptionListView";
import {getMyName, Name, UserNameObservable} from "../../datamodel/name";
import AllCarts from "../../datamodel/cart/allCarts";


interface MyCartProps {
    allCarts: AllCarts;
    restaurant: Restaurant;
}

interface MyCartState {
    userName?: Name
    redirectLogout: boolean;
    redirectOrder: boolean;
}

export class MyCart extends React.Component<MyCartProps, MyCartState> {
    constructor(props: MyCartProps, context: any) {
        super(props, context);
        this.state = {userName:getMyName(), redirectLogout: false, redirectOrder: false}
    }

    nameObserver = (name: Name) => {
        this.setState({userName: name});
    }

    componentDidMount() {
        UserNameObservable.subscribe(this.nameObserver);
    }

    componentWillUnmount() {
        UserNameObservable.unsubscribe(this.nameObserver);
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

        if (!this.state.userName || !this.props.restaurant) {
            return <></>
        }

        let myCart = this.props.allCarts.carts.find(value => this.state.userName != undefined && value.name == this.state.userName!.longName);

        if (myCart == undefined || myCart.entries.length == 0) {
            return (<>
                    <h1>Noch keine Bestellung, {myCart == undefined ? "" : myCart.name}</h1>
                    <PixmapGroup>
                        <PixmapButton onClick={this.order}
                                      pixmap="add"
                                      text="Neue Bestellung"
                                      className="primary"
                                      disabled={AllCartsObservable.getValue().submittedAt > 0}
                        />
                        <PixmapButton onClick={this.logout}
                                      pixmap="logout"
                                      text={'Ich bin nicht ' + this.state.userName.longName}/><br/>
                    </PixmapGroup>
                </>
            );
        }

        return (
            <>
                <h1><>Deine Bestellung, {this.state.userName.longName}</>
                </h1>
                <PixmapGroup>
                    <ToggleCartPaid
                        cart={myCart}
                    />
                    <PixmapButton onClick={this.order}
                                  pixmap="add"
                                  text="Neue Bestellung"
                                  className="primary"
                                  disabled={AllCartsObservable.getValue().submittedAt > 0}
                    />
                    <PixmapButton onClick={this.logout} pixmap="logout"
                                  text={'Ich bin nicht ' + myCart.name}/><br/>
                </PixmapGroup>
                <br/>
                <div className="myOrder">
                    <p>
                        <Pixmap
                            pixmap={myCart.payed ? "done" : "close"}
                            text={myCart.payed ? "Du hast schon bezahlt" : "Du musst noch bezahlen"}
                            className={myCart.getPaymentClass()}
                        /> <br/>
                        {myCart.getPrice(this.props.restaurant.menu).toFixed(2)} €
                    </p>
                    <p>
                        {
                            myCart.entries.map(entry =>
                                <OptionListView
                                    key={entry.id}
                                    entry={entry}
                                    restaurant={this.props.restaurant!}
                                />)
                        }
                    </p>
                </div>
            </>
        )
    }
}