import { Link } from "react-router-dom";
import "./css/Header.css";

function Header({ isAuthenticated }) {
  return (
    <header className="header">
      <img 
        className="header__icon"
        src="/public/images/logo.jpg"
        alt="Vasano Ristorante Logo"
      />
      <div className="header__right">
        {isAuthenticated ? (
          <>
            <Link to="/menu" className="nav-link">Show Menu</Link>
            <Link to="/logout" className="nav-link">Logout</Link>
          </>
        ) : (
          <>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/menu" className="nav-link">Show Menu</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
