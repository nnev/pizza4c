import React from 'react';
import './App.css';
import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import {Order} from "./components/order/Order";
import {CustomizeProduct} from "./components/customize/CustomizeProduct";
import {getCurrentRestaurant} from "./backend/restaurant";
import {Overview} from "./components/overview/Overview";
import ChangeName from "./components/managment/ChangeName";
import {fetchAllCarts} from "./backend/Cart";
import {SubmitGroupOrder} from "./components/submit/SubmitGroupOrder";
import {RenderPdf} from "./components/submit/RenderPdf";
import {CustomizeVariant} from "./components/customize/CustomizeVariant";
import {AdminObservable} from "./datamodel/admin";
import BecomeAdmin from "./components/managment/BecomeAdmin";
import FormattedError, {ErrorObservable} from "./datamodel/error";
import {Error} from "./components/Error";
import Restaurant from "./datamodel/restaurant/restaurant";
import {OrderList} from "./components/order/OrderList";

interface AppProps {
}

interface AppState {
    admin: boolean;
    error?: FormattedError;
}


class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps, context: any) {
        super(props, context);
        this.state = {admin: false}
    }

    adminListener = (value: boolean) => {
        console.log("+++++++++++" + value);
        this.setState({admin: value});
    }
    errorListener = (value: FormattedError) => {
        this.setState({error: value});
    }


    componentDidMount() {
        getCurrentRestaurant();
        fetchAllCarts();
        console.log("##### subscribe")
        AdminObservable.subscribe(this.adminListener)
        ErrorObservable.subscribe(this.errorListener)
    }

    componentWillUnmount() {
        console.log("----- unsubscribe")
        AdminObservable.unsubscribe(this.adminListener)
        ErrorObservable.unsubscribe(this.errorListener)
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <nav className="menu">
                        <Link to="/">Overview</Link>
                        <Link to="/renderPdf">PDF anschauen</Link>
                        {this.state.admin && <Link to="/submitGroupOrder">Bestellung abschicken</Link>}
                        <Link to="/becomeAdmin">{this.state.admin ? "Admin droppen" : "Admin werden"}</Link>

                    </nav>
                    <div className="container">
                        <div className="row">
                            {this.state.error && <>
                                <main className="notSide">
                                    <h1>Something went horribly wrong:</h1>
                                    <Error text={this.state.error.message}/>
                                </main>
                            </>}
                            <Routes>
                                <Route path="/order" element={<Order/>}/>
                                <Route path="/customize/:productId/:variantId" element={<CustomizeVariant/>}/>
                                <Route path="/customize/:productId" element={<CustomizeProduct/>}/>
                                <Route path="/changeName" element={<ChangeName/>}/>
                                <Route index element={<Overview/>}/>
                                <Route path="*" element={<Navigate to="/" replace/>}/>
                                <Route path="/submitGroupOrder" element={<SubmitGroupOrder/>}/>
                                <Route path="/becomeAdmin" element={<BecomeAdmin/>}/>
                                <Route path="/renderPdf" element={<RenderPdf/>}/>
                            </Routes>
                        </div>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}

export default App;
