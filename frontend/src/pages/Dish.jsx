import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/MenuHeader";
import { addToCart } from "../utils/cartUtils";
import Cart from "../components/Cart";
import "./css/Dish.css";

const Dish = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await fetch(`/dishes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch dish details");
        }
        const data = await response.json();
        setDish(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!dish) return <p className="error-text">No dish found.</p>;

  return (
    <>
      <Header toggleCart={() => setIsCartOpen(!isCartOpen)} />
      <div className="dish-detail-container">
        <div className="dish-image-container">
          <img src={dish.imageUrl} alt={dish.name} className="dish-image" />
        </div>

        <div className="dish-info">
          <h1>{dish.name}</h1>
          <p className="dish-description">{dish.description}</p>
          <p className="dish-price">
            Price: <strong>{dish.price.toFixed(2)} €</strong>
          </p>
          {dish.categories.length > 0 && (
            <p>
              <strong>Categories:</strong> {dish.categories.join(", ")}
            </p>
          )}
          {dish.sides.length > 0 && (
            <p>
              <strong>Sides:</strong> {dish.sides.join(", ")}
            </p>
          )}
          <button
            className="add-to-cart-button"
            onClick={() => addToCart(dish)}
          >
            Add to Cart
          </button>
        </div>
        <Cart
          isOpen={isCartOpen}
          toggleCart={() => setIsCartOpen(!isCartOpen)}
        />
      </div>
    </>
  );
};

export default Dish;
