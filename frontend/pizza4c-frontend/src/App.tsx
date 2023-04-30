import React from 'react';
import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import {Order} from "./components/order/Order.tsx";
import {CustomizeProduct} from "./components/customize/CustomizeProduct.tsx";
import {getCurrentRestaurant} from "./backend/restaurant.ts";
import {Overview} from "./components/overview/Overview.tsx";
import ChangeName from "./components/managment/ChangeName.tsx";
import {fetchAllCarts} from "./backend/Cart.ts";
import {SubmitGroupOrder} from "./components/submit/SubmitGroupOrder.tsx";
import {RenderPdf} from "./components/submit/RenderPdf.tsx";
import {CustomizeVariant} from "./components/customize/CustomizeVariant.tsx";
import {AdminObservable} from "./datamodel/admin.ts";
import FormattedError, {ErrorObservable} from "./datamodel/error.ts";
import {Error} from "./components/Error.tsx";
import Privacy from "./components/Privacy.tsx";
import Admin from "./components/managment/Admin.tsx";

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

        window.setInterval(() => fetchAllCarts(), 30 * 1000)
        window.setInterval(() => getCurrentRestaurant(), 30 * 60 * 1000)
    }

    adminListener = (value: boolean) => {
        this.setState({admin: value});
    }
    errorListener = (value: FormattedError) => {
        this.setState({error: value});
    }

    componentDidMount() {
        AdminObservable.subscribe(this.adminListener)
        ErrorObservable.subscribe(this.errorListener)
        fetchAllCarts();
        getCurrentRestaurant()
    }

    componentWillUnmount() {
        AdminObservable.unsubscribe(this.adminListener)
        ErrorObservable.unsubscribe(this.errorListener)
    }

    render() {
        return (
            <>
                <BrowserRouter>
                    <nav className="menu">
                        <Link to="/" className="borderRight">🍕4Chaos</Link>
                        <Link to="/renderPdf" className="borderRight">PDF anschauen</Link>
                        <Link to="/becomeAdmin" className="borderRight">{this.state.admin ? "Admin stuff" : "Admin werden"}</Link>
                        <span className="variableSpacer"/>
                        <Link to="/privacy" className="borderLeft">Privacy</Link>
                        <a href="https://github.com/nnev/pizza4c/issues" target="_blank" className="borderLeft">Report Bugs</a>

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
                                <Route path="/becomeAdmin" element={<Admin/>}/>
                                <Route path="/renderPdf" element={<RenderPdf/>}/>
                                <Route path="/privacy" element={<Privacy/>}/>
                            </Routes>
                        </div>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}

export default App;
