import { useState } from "react";
import Header from "../components/MenuHeader";
import DishList from "../components/DishList";
import Cart from "../components/Cart"; // Import Cart component
import "./css/Menu.css";

function Menu() {
  document.title = "Menu Page";
  const [isCartOpen, setIsCartOpen] = useState(false); // State to manage cart visibility

  return (
    <div className="homee-container">
      <Header toggleCart={() => setIsCartOpen(!isCartOpen)} /> {/* Pass toggle function */}
      <main className="maine-content">
        <DishList />
      </main>
      <Cart isOpen={isCartOpen} toggleCart={() => setIsCartOpen(!isCartOpen)} /> {/* Pass state to Cart */}
    </div>
  );
}

export default Menu;
