import Cart from "../../datamodel/cart/cart.ts";
import Restaurant from "../../datamodel/restaurant/restaurant.ts";
import React from "react";
import {getVariant} from "../../datamodel/restaurant/menu.ts";
import {OptionListView} from "./OptionListView.tsx";
import {ToggleCartPaid} from "./ToggleCartPaid.tsx";
import {RemoveEntry} from "./RemoveEntry.tsx";
import {joinClasses} from "../../util/JoinClasses.ts";
import {getMyName, Name, UserNameObservable} from "../../datamodel/name.ts";

interface CartViewProps {
    cart: Cart;
    restaurant: Restaurant;

    isAdmin: boolean;
}

interface CartViewState {
    userName?: Name
}


export class CartView extends React.Component<CartViewProps, CartViewState> {

    constructor(props: CartViewProps, context: any) {
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
        let menu = this.props.restaurant.menu;

        let results: JSX.Element[] = [];

        if (this.props.cart.entries.length === 0) {
            return <></>
        }

        let canEditCart = this.props.isAdmin || this.props.cart.isMyCart(this.state.userName);


        results.push(
            <tr
                key={this.props.cart.id}
                className="cartOwner"
            >
                <td className={joinClasses("box", this.props.cart.getPaymentClass())}>&nbsp;</td>
                <td className="grow textCenter" colSpan={2}>{this.props.cart.name}</td>
                <td className="textCenter">{this.props.cart.shortName}</td>
                <td>
                    {
                        canEditCart &&
                        <ToggleCartPaid
                            cart={this.props.cart}
                            className="grow tiny"
                        />
                    }
                </td>
            </tr>
        )
        this.props.cart.entries.forEach((entry, index) => {
            let variant = getVariant(menu, entry.product, entry.variant);

            results.push(
                <tr key={entry.id} className={index == 0 ? "cartBegin" : ""}>
                    <td className={joinClasses("box", this.props.cart.getPaymentClass())}>&nbsp;</td>
                    <td className="grow"><OptionListView entry={entry} restaurant={this.props.restaurant}/></td>
                    <td>{variant && variant.name}</td>
                    <td className="textCenter">{entry.getPrice(menu).toFixed(2)} €</td>
                    <td className="textCenter">
                        {
                            canEditCart &&
                            <RemoveEntry
                                entry={entry}
                                className="grow tiny"
                            />
                        }
                    </td>
                </tr>
            )
        })

        return results;
    }
}