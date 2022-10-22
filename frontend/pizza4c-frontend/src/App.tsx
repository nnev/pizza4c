import React from 'react';
import './App.css';
import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import {Order} from "./components/order/Order";
import {Customize} from "./components/customize/Customize";
import {getCurrentRestaurant} from "./backend/restaurant";
import {Overview} from "./components/overview/Overview";
import ChangeName from "./components/managment/ChangeName";

function App() {
    getCurrentRestaurant();
    return (
        <div className="App">
            <BrowserRouter>
                <div className="menu">
                    <Link to="/">Overview</Link>
                    <Link to="/">Render PDF</Link>
                    <Link to="/">Submit Group Order</Link>
                </div>
                <Routes>
                    <Route path="/order" element={<Order/>}/>
                    <Route path="/customize/:productId" element={<Customize/>}/>
                    <Route path="/changeName" element={<ChangeName/>}/>
                    <Route index element={<Overview/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
