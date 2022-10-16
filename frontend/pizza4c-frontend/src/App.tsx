import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Order} from "./components/Order";
import {Customize} from "./components/Customize";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/order" element={<Order/>}/>
                    <Route path="/customize/:productId" element={<Customize/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
