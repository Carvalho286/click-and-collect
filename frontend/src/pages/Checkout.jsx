import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCart } from "../utils/cartUtils";
import { Link } from "react-router-dom";
import "./css/Checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [checkoutType, setCheckoutType] = useState("guest");
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const cartDishIds = cart.map((dish) => dish._id);
  const cartDishPrices = cart.map((dish) => dish.price);

  const onSubmit = (data) => {
    console.log("Submitting data:", data);
    postUser(data);
  };

  const onSubmitRegister = (data) => {
    const userData = {
      ...data,
      role: {
        name: "Client",
        scopes: ["client"],
      },
    };
    postUserRegister(userData);
  };

  const onSubmitGuest = (data) => {
    const userData = {
      ...data,
    };
    postGuestRegister(userData);
  };

  const postUser = (data) => {
    console.log("Posting data:", data);

    fetch("/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (response.ok) {
          nav("/payment", { state: { ids: cartDishIds, prices: cartDishPrices } });
        } else {
          alert("Wrong email or password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const postUserRegister = (data) => {
    fetch("/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          const loginData = {
            email: data.email,
            password: data.password,
          };
          
          postUser(loginData);
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const postGuestRegister = (data) => {
    console.log("Posting data:", data);

    fetch("/guests/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((guestData) => {
      if (guestData && guestData._id) {
        nav("/payment", { state: { user: guestData, ids: cartDishIds, prices: cartDishPrices } });
      }
    })
    .catch((error) => console.error("Error:", error));
  };

  const handleRemove = (dishId) => {
    removeFromCart(dishId);
    setCart(getCart());
  };

  


  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2 className="checkout-arrow">
          <Link to="/menu">
            <img src="/public/images/arrow.png" />
          </Link>
        </h2>
        <h2 className="checkout-title">Cart</h2>
      </div>
      <div className="checkout-options">
        <h3>Checkout Options</h3>
        <label className="checkout-option">
          <input
            type="radio"
            value="account"
            checked={checkoutType === "account"}
            onChange={() => setCheckoutType("account")}
          />{" "}
          Create an account
        </label>
        <label className="checkout-option">
          <input
            type="radio"
            value="guest"
            checked={checkoutType === "guest"}
            onChange={() => setCheckoutType("guest")}
          />{" "}
          Checkout as Guest
        </label>
        <label className="checkout-option">
          <input
            type="radio"
            value="login"
            checked={checkoutType === "login"}
            onChange={() => setCheckoutType("login")}
          />{" "}
          Already have an account? Login
        </label>
      </div>

      {checkoutType === "login" && (
        <div className="login-form">
          <h3>Login</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              {...register("email")}
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              {...register("password")}
            />
            <button className="login-btn" type="submit">
              Login
            </button>
          </form>
        </div>
      )}

      {checkoutType === "guest" && (
        <div className="login-form">
          <h3>Guest Information</h3>
          <form onSubmit={handleSubmit(onSubmitGuest)}>
            <input
              type="text"
              placeholder="Name"
              className="login-input"
              {...register("name")}
            />
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              {...register("email")}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="login-input"
              {...register("phone")}
            />
            <div className="address-container">
              <input
                type="text"
                placeholder="Address"
                className="login-input address-input"
                {...register("address")}
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="login-input postal-code-input"
                {...register("postalCode")}
              />
            </div>
            <button className="login-btn" type="submit">
              Login
            </button>
          </form>
        </div>
      )}

      {checkoutType === "account" && (
        <div className="login-form">
          <h3>Register</h3>
          <form onSubmit={handleSubmit(onSubmitRegister)}>
            <input
              type="text"
              placeholder="Name"
              className="login-input"
              {...register("name", { required: "Name is required" })}
            />
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              {...register("email")}
            />
            <input
              type="text"
              placeholder="Phone"
              className="login-input"
              {...register("phone", {
                required: "Phone number is required",
              })}
            />
            <div className="address-container">
              <input
                type="text"
                placeholder="Address"
                className="login-input address-input"
                {...register("address", { required: "Address is required" })}
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="login-input postal-code-input"
                {...register("postalCode", {
                  required: "Postal Code is required",
                  pattern: {
                    value: /^[0-9]{4,8}$/,
                    message: "Invalid postal code",
                  },
                })}
              />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              {...register("password")}
            />
            <button className="login-btn" type="submit">
              Register
            </button>
          </form>
        </div>
      )}

      <div className="cart-summary">
        <h3>Your cart summary</h3>
        <ul className="cart-items">
          {cart.length === 0 ? (
            <p>Cart is empty.</p>
          ) : (
            cart.map((item) => (
              <li key={item._id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <p>{item.name}</p>
                  <strong>{item.price}€</strong>
                </div>
                <button onClick={() => handleRemove(dish._id)}>🗑️</button>
              </li>
            ))
          )}
        </ul>
      </div>

      <Link to="/payment" className="checkout-btn">
        Finish checkout
      </Link>
    </div>
  );
};

export default Checkout;
