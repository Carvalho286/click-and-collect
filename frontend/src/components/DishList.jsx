import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import axios from "axios";
import "./css/DishList.css";


function DishList() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dishesPerPage = 8;

  useEffect(() => {
    fetchDishes();
  }, [selectedCategory, searchQuery]);

  const fetchDishes = async () => {
    try {
      let url = "/dishes";
      if (selectedCategory) {
        url = `/dishes/category?categories=${selectedCategory}`;
      }
      if (searchQuery) {
        url = `/dishes/search?name=${searchQuery}`;
      }
      const response = await axios.get(url);
      setDishes(response.data);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/dishes");
      const allCategories = new Set(
        response.data.flatMap((dish) => dish.categories)
      );
      setCategories([...allCategories]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;
  const currentDishes = dishes.slice(indexOfFirstDish, indexOfLastDish);
  const totalPages = Math.ceil(dishes.length / dishesPerPage);

  return (
    <div className="menu-container">
      <aside className="sidebar">
        <h3>Categories</h3>
        <ul>
          <li
            className={!selectedCategory ? "active" : ""}
            onClick={() => setSelectedCategory("")}
          >
            All
          </li>
          {categories.map((category, index) => (
            <li
              key={index}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      <div className="dish-section">
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for a dish..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 0) {
                setSelectedCategory("");
              }
            }}
          />
        </div>

        <div className="dish-list">
          {currentDishes.map((dish) => (
            <div className="dish-card" key={dish._id}>
            <Link to={`/dish/${dish._id}`} className="dish-card-content">
              <img src={`${dish.imageUrl}`} alt={dish.name} />
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <strong>{dish.price}€</strong>
            </Link>
            {/* <button className="add-to-cart-btn"></button> */}
            {/* <button className="add-to-cart-btn"><img src="/public/images/add-cart.png" /></button> */}
            <button className="add-to-cart-btn" onClick={() => addToCart(dish)}><img src="/public/images/plus.png" /></button>
          </div>                   
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DishList;
