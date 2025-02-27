import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Dish from "./pages/Dish";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Logout from "./components/Logout";
import "./App.css";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/dish/:id" element={<Dish />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}

export default App;
