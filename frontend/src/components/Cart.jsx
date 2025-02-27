import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart, removeFromCart, clearCart } from "../utils/cartUtils";
import "./css/Cart.css";

const Cart = ({ isOpen, toggleCart }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart()); // Update cart whenever it opens
  }, [isOpen]);

  useEffect(() => {
    const updateCart = () => setCart(getCart()); // Function to update cart

    window.addEventListener("cartUpdated", updateCart); // Listen for cart updates

    return () => window.removeEventListener("cartUpdated", updateCart); // Cleanup
  }, []);

  const handleRemove = (dishId) => {
    removeFromCart(dishId);
    setCart(getCart()); // Update cart immediately
  };

  const handleClear = () => {
    clearCart();
    setCart([]); // Empty cart
  };

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={toggleCart}></div>}

      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleCart}>
          ✖
        </button>
        <h3>Your Cart</h3>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((dish) => (
              <li key={dish._id}>
                <img src={dish.imageUrl} alt={dish.name} />
                <div className="item-info">
                  <p>{dish.name}</p>
                  <strong>{dish.price}€</strong>
                </div>
                <button onClick={() => handleRemove(dish._id)}>🗑️</button>
              </li>
            ))}
          </ul>
        )}

        {cart.length > 0 && (
          <>
            <button className="clear-btn" onClick={handleClear}>
              Clear Cart
            </button>
            <div className="cart-footer">
              <Link
                to="/checkout"
                className="checkout-btn"
                onClick={toggleCart}
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
