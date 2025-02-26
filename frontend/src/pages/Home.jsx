import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./css/Home.css";

function Home() {
  document.title = "Home Page";
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/auth/me", { credentials: "include" })
      .then((response) => {
        if (response.status === 202) {
          setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("isAuthenticated");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      });
  }, []);

  return (
    <div className="home-container">
      <Header isAuthenticated={isAuthenticated} />
      <main className="main-content">
        <h1>Welcome to Va sano Ristorante</h1>
        <p>Experience the best Italian cuisine in town!</p>
      </main>
      <Footer />
    </div>
  );
}

export default Home;