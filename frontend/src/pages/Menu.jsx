import { useState } from "react";
import Header from "../components/MenuHeader";
import DishList from "../components/DishList";
import Cart from "../components/Cart";
import "./css/Menu.css";

function Menu() {
  document.title = "Menu Page";
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="homee-container">
      <Header toggleCart={() => setIsCartOpen(!isCartOpen)} />
      <main className="maine-content">
        <DishList />
      </main>
      <Cart isOpen={isCartOpen} toggleCart={() => setIsCartOpen(!isCartOpen)} />
    </div>
  );
}

export default Menu;
