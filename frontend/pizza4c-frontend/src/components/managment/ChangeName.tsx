import React, {ChangeEvent, MouseEvent} from "react";
import Cart from "../../datamodel/cart/cart";
import {fetchMyCart, MyCartObservable} from "../../backend/Cart";
import {changeName} from "../../backend/management";
import {Navigate} from "react-router-dom";

interface ChangeNameProps {
}

interface ChangeNameState {
    name: string;
    nameChanged: boolean;
}

export default class ChangeName extends React.Component<ChangeNameProps, ChangeNameState> {

    constructor(props: ChangeNameProps, context: any) {
        super(props, context);
        this.state = {
            nameChanged: false,
            name: ""
        }
    }

    myCartObserver = (cart: Cart) => {
        this.setState({
            name: cart.name
        });
    }

    componentDidMount() {
        MyCartObservable.subscribe(this.myCartObserver);
        if (!MyCartObservable.hasValue()) {
            fetchMyCart();
        }
    }

    componentWillUnmount() {
        MyCartObservable.unsubscribe(this.myCartObserver);
    }

    changeName = (ev: ChangeEvent<HTMLInputElement>) => {
        this.setState({name: ev.target.value})
    }
    changeNameSubmit = (ev: MouseEvent<HTMLInputElement>) => {
        ev.preventDefault();
        changeName(this.state.name).then(value => {
            this.setState({nameChanged: true});
        });
        return;
    }

    render() {
        if (this.state.nameChanged) {
            return <Navigate to="/"/>;
        }
        return (
            <form>
                <label htmlFor="name">Name:</label>
                <input type="text"
                       name="name"
                       id="name"
                       value={this.state.name}
                       placeholder="Set a name"
                       minLength={3}
                       onChange={this.changeName}
                />
                <input type="submit" onClick={this.changeNameSubmit}/>
            </form>
        );
    }
}