import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../utils/cartUtils";
import "./css/Payment.css";

const Payment = () => {
  const nav = useNavigate();
  const location = useLocation();
  const guest = location.state?.user || {};
  const cartDishIds = location.state?.ids || [];
  const cartDishPrices = location.state?.prices || [];
  const [user, setUser] = useState([]);

  const { register, handleSubmit } = useForm();

  const handleClear = () => {
    clearCart();
    setCart([]);
  };

  useEffect(() => {
    fetch("/users/me", {
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((response) => {
        setUser(response);
      });
    return () => setUser([]);
  }, []);

  // Calculate total price
  const totalPrice = cartDishPrices.reduce((sum, price) => sum + price, 0);

  // Count occurrences of each dishId
  const dishCountMap = cartDishIds.reduce((acc, dishId) => {
    acc[dishId] = (acc[dishId] || 0) + 1;
    return acc;
  }, {});

  // Convert count map to array
  const dishes = Object.entries(dishCountMap).map(([dishId, quantity]) => ({
    dishId,
    quantity,
  }));

  const onSubmit = (data) => {
    const reservationData = {
      client: user ? user._id : undefined,
      guest: guest._id || undefined,
      dishes,
      totalPrice,
      status: "pending",
      reservationTime: data.reservationTime,
    };

    fetch("/reservations/regist", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(reservationData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Reservation successful!");
          handleClear();
          nav("/menu");
        } else {
          alert("Failed to make reservation.");
        }
      })
      .catch((error) => console.error("Error submitting reservation:", error));
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>

      <div className="payment-options">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Payment Method:</h3>
          <select {...register("paymentMethod")}>
            <option value="OnSite">Pay at pickup</option>
          </select>

          <h3>Select Time to Pickup:</h3>
          <input
            type="datetime-local"
            {...register("reservationTime", { required: true })}
          />

          <h3>Total Price: {totalPrice.toFixed(2)}€</h3>

          <input type="submit" value="Confirm Reservation" />
        </form>
      </div>
    </div>
  );
};

export default Payment;
