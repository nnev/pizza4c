import React from "react";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import {Pixmap} from "../Pixmap.tsx";
import {OptionListView} from "./OptionListView.tsx";
import {getMyName, Name, UserNameObservable} from "../../datamodel/name.ts";
import AllCarts from "../../datamodel/cart/allCarts.ts";
import {MyCartHeader} from "./MyCartHeader.tsx";


interface MyCartProps {
    allCarts: AllCarts;
    restaurant: Restaurant;
}

interface MyCartState {
    userName?: Name
}

export class MyCart extends React.Component<MyCartProps, MyCartState> {
    constructor(props: MyCartProps, context: any) {
        super(props, context);
        this.state = {userName: getMyName()}
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

    render() {
        if (!this.state.userName || !this.props.restaurant) {
            return <></>
        }

        let myCart = this.props.allCarts.carts.find(value => this.state.userName != undefined && value.name == this.state.userName!.longName);

        if (myCart == undefined || myCart.entries.length == 0) {
            return (<>
                    <h1>Noch keine Bestellung, {myCart == undefined ? this.state.userName.longName : myCart.name}</h1>
                    <MyCartHeader
                        name={this.state.userName.longName}
                    />
                </>
            );
        }

        return (
            <>
                <h1>
                    <>Deine Bestellung, {this.state.userName.longName}</>
                </h1>
                <MyCartHeader
                    cart={myCart}
                    name={myCart.name}
                />
                <br/>
                <div className="myOrder">
                    <p>
                        <Pixmap
                            pixmap={myCart.payed ? "done" : "close"}
                            text={myCart.payed ? "Du hast schon bezahlt" : "Du musst noch bezahlen"}
                            className={myCart.getPaymentClass()}
                        /> <br/>
                        <b>Preis</b>: {myCart.getPrice(this.props.restaurant.menu).toFixed(2)} €
                    </p>
                    <ol>
                        {
                            myCart.entries.map(entry =>
                                <li key={entry.id}>
                                    <OptionListView
                                        entry={entry}
                                        restaurant={this.props.restaurant!}
                                    />
                                </li>)
                        }
                    </ol>
                </div>
            </>
        )
    }
}