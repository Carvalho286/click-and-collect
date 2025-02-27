import { Link } from "react-router-dom";
import "./css/MenuHeader.css";

function MenuHeader({ toggleCart }) {
  return (
    <header className="header">
      <Link to="/">
        <img
          className="header__icon"
          src="/public/images/logo.jpg"
          alt="Vasano Ristorante Logo"
        />
      </Link>
      <div className="header__right">
        <button className="header__cart-btn" onClick={toggleCart}>
          <img
            className="header__cart"
            src="/public/images/cart.png"
            alt="Cart"
          />
        </button>
      </div>
    </header>
  );
}

export default MenuHeader;
