export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const addToCart = (dish) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(dish);
  localStorage.setItem("cart", JSON.stringify(cart));

  window.dispatchEvent(new Event("cartUpdated")); // Trigger event to update cart
};

export const removeFromCart = (dishId) => {
  let cart = getCart();
  cart = cart.filter((item) => item._id !== dishId);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
