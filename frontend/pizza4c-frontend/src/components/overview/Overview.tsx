import React, {MouseEvent} from "react";
import Restaurant from "../../datamodel/restaurant/restaurant";
import {CurrentRestaurantObservable} from "../../backend/restaurant";
import {
    AllCartsObservable,
    fetchAllCarts,
    fetchMyCart,
    markAsPaid,
    markAsUnpaid,
    MyCartObservable
} from "../../backend/Cart";
import Cart from "../../datamodel/cart/cart";
import {Pixmap, PixmapButton} from "../Pixmap";
import {Link, Navigate} from "react-router-dom";
import CartEntry from "../../datamodel/cart/cartEntry";
import {getVariant} from "../../datamodel/restaurant/menu";
import {sumReducer} from "../../util/Reducers";
import {renderPdf} from "../../backend/RenderPdf";

interface markPaid {
    (paid: boolean): void
}

interface ToggleCartPaidProps {
    cart: Cart
    onMarkPaid: Function
    onMarkUnpaid: Function
}

interface ToggleCartPaidState {
}

class ToggleCartPaid extends React.Component<ToggleCartPaidProps, ToggleCartPaidState> {
    render() {
        if (this.props.cart.payed) {
            return <PixmapButton
                onClick={event => this.props.onMarkUnpaid()}
                pixmap={"money_off"}
                text={"Mark as Unpaid"}/>
        }
        return <PixmapButton
            onClick={event => this.props.onMarkPaid()}
            pixmap={"paid"}
            text={"Mark as Paid"}/>
    }
}

interface OptionListViewProps {
    entry: CartEntry;
    restaurant: Restaurant;
}

interface OptionListViewState {
}

class OptionListView extends React.Component<OptionListViewProps, OptionListViewState> {
    render() {
        let menu = this.props.restaurant.menu;
        let options = this.props.entry.options;
        let mappedOptions: JSX.Element[] = []
        for (let optionGroupKey in options) {
            let optionIds = options[optionGroupKey];
            for (let optionId of optionIds) {
                let option = menu.options[optionId];
                console.log(optionGroupKey, option)
                if (option) {
                    mappedOptions.push(
                        <>
                            &nbsp;&nbsp;+&nbsp;{option.name}<br/>
                        </>
                    )
                }
            }
        }

        return (
            <>
                {menu.products[this.props.entry.product].name}
                <br/>
                {mappedOptions}
            </>
        )
    }
}

interface CartViewProps {
    cart: Cart;
    restaurant: Restaurant;
}

interface CartViewState {
}

class CartView extends React.Component<CartViewProps, CartViewState> {
    render() {
        let menu = this.props.restaurant.menu;

        let results: JSX.Element[] = [];

        this.props.cart.entries.forEach((entry, index) => {
            let variant = getVariant(menu, entry.product, entry.variant);
            results.push(
                <tr className={index == 0 ? "cartBegin" : ""}>
                    <td className="grow"><OptionListView entry={entry} restaurant={this.props.restaurant}/></td>
                    <td>{variant && variant.name}</td>
                    <td>{(entry.getPrice(menu) / 100).toFixed(2)}</td>
                    {index == 0 && <>
                        <td rowSpan={this.props.cart.entries.length}>{this.props.cart.name}</td>
                        <td rowSpan={this.props.cart.entries.length}>{this.props.cart.shortName}</td>
                        <td rowSpan={this.props.cart.entries.length}><ToggleCartPaid
                            cart={this.props.cart}
                            onMarkPaid={() => markAsPaid(this.props.cart).then(value => fetchAllCarts())}
                            onMarkUnpaid={() => markAsUnpaid(this.props.cart).then(value => fetchAllCarts())}
                        />
                        </td>
                    </>
                    }
                </tr>
            )
        })

        return results;
    }
}

interface CartsViewProps {
    carts: Cart[];
    restaurant: Restaurant;
}

interface CartsViewState {
}

class CartsView extends React.Component<CartsViewProps, CartsViewState> {

    constructor(props: CartsViewProps, context: any) {
        super(props, context);
    }

    render() {

        let view: JSX.Element[] = [];
        this.props.carts.forEach(cart => {
            view.push(<CartView
                key={cart.id}
                cart={cart}
                restaurant={this.props.restaurant}
            />)
        });

        return (
            <>
                Summe: {
                this.props.carts
                    .map(value => {
                        return value.getPrice(this.props.restaurant.menu);
                    })
                    .reduce(sumReducer, 0)
            }€
                <table className="orderTable">
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Größe</th>
                        <th>Preis (€)</th>
                        <th>Nick</th>
                        <th>Beschriftung</th>
                        <th>Aktionen</th>
                    </tr>
                    </thead>
                    <tbody>
                    {view}
                    </tbody>
                </table>
            </>
        )
    }
}

interface OverviewProps {
}

interface OverviewState {
    restaurant?: Restaurant
    myCart?: Cart
    allCarts?: Cart[],
    redirectLogout: boolean;
}

export class Overview extends React.Component<OverviewProps, OverviewState> {
    constructor(props: OverviewProps, context: any) {
        super(props, context);
        this.state = {redirectLogout: false}
    }

    restaurantObserver = (value: Restaurant) => {
        this.setState({restaurant: value});
    }
    myCartObserver = (cart: Cart) => {
        this.setState({myCart: cart});
    }
    allCartsObserver = (carts: Cart[]) => {
        this.setState({allCarts: carts});
    }

    componentDidMount() {
        CurrentRestaurantObservable.subscribe(this.restaurantObserver);
        MyCartObservable.subscribe(this.myCartObserver);
        AllCartsObservable.subscribe(this.allCartsObserver);

        fetchAllCarts();
        fetchMyCart();
    }

    componentWillUnmount() {
        CurrentRestaurantObservable.unsubscribe(this.restaurantObserver);
        MyCartObservable.unsubscribe(this.myCartObserver);
        AllCartsObservable.unsubscribe(this.allCartsObserver);
    }

    logout = (ev: MouseEvent<any>) => {
        ev.preventDefault();
        this.setState({redirectLogout: true});
    }

    render() {
        if (this.state.redirectLogout) {
            this.setState({redirectLogout: false});
            return <Navigate to="/changeName"/>
        }

        if (!this.state.myCart || !this.state.allCarts || !this.state.restaurant) {
            return <></>
        }

        let menu = this.state.restaurant.menu;

        return (
            <main>
                <PixmapButton onClick={()=>renderPdf()} pixmap="render" text="render" />
                Deine Bestellung, {this.state.myCart!.name}<br/>
                <ToggleCartPaid
                    cart={this.state.myCart!}
                    onMarkPaid={() => markAsPaid(this.state.myCart!).then(value => fetchMyCart()).then(value => fetchAllCarts())}
                    onMarkUnpaid={() => markAsUnpaid(this.state.myCart!).then(value => fetchMyCart()).then(value => fetchAllCarts())}
                />
                <PixmapButton onClick={this.logout} pixmap="logout" text={'I am not ' + this.state.myCart.name}/><br/>
                <Pixmap
                    pixmap={this.state.myCart.payed ? "done" : "close"}
                    text={this.state.myCart.payed ? "You appear marked as payed" : "You still need to pay"}
                /><br/>
                {
                    this.state.myCart.entries.map(entry =>
                        <OptionListView
                            key={entry.id}
                            entry={entry}
                            restaurant={this.state.restaurant!}
                        />)
                }
                <Link to="/order">Order</Link>
                <h2>Bezahlt:</h2>
                <CartsView carts={this.state.allCarts.filter(value => value.payed)}
                           restaurant={this.state.restaurant!}/>
                <h2>Nicht bezahlt</h2>
                <CartsView carts={this.state.allCarts.filter(value => !value.payed)}
                           restaurant={this.state.restaurant!}/>
            </main>
        )
    }
}