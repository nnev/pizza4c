import React from 'react';
import './App.css';
import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import {Order} from "./components/order/Order";
import {CustomizeProduct} from "./components/customize/CustomizeProduct";
import {getCurrentRestaurant} from "./backend/restaurant";
import {Overview} from "./components/overview/Overview";
import ChangeName from "./components/managment/ChangeName";
import {fetchAllCarts, fetchMyCart} from "./backend/Cart";
import {SubmitGroupOrder} from "./components/submit/SubmitGroupOrder";
import {RenderPdf} from "./components/submit/RenderPdf";
import {CustomizeVariant} from "./components/customize/CustomizeVariant";

function App() {
    getCurrentRestaurant();
    fetchAllCarts();
    fetchMyCart();

    return (
        <>
            <BrowserRouter>
                <nav className="menu">
                    <Link to="/">Overview</Link>
                    <Link to="/renderPdf">Render PDF</Link>
                    <Link to="/submitGroupOrder">Submit Group Order</Link>
                </nav>
                <div className="container">
                    <div className="row">
                        <Routes>
                            <Route path="/order" element={<Order/>}/>
                            <Route path="/customize/:productId/:variantId" element={<CustomizeVariant/>}/>
                            <Route path="/customize/:productId" element={<CustomizeProduct/>}/>
                            <Route path="/changeName" element={<ChangeName/>}/>
                            <Route index element={<Overview/>}/>
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                            <Route path="/submitGroupOrder" element={<SubmitGroupOrder/>}/>
                            <Route path="/renderPdf" element={<RenderPdf/>}/>
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </>
    );
}

export default App;
