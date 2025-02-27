import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./components/Cart";
import Dish from "./pages/Dish";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Logout from "./components/Logout";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/auth/me", { credentials: "include" })
      .then((response) => {
        if (response.status === 202) {
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/dish/:id" element={<Dish />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}

export default App;
