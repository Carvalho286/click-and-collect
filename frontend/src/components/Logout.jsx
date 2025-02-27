import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Logout() {
  document.title = "Logout";
  const nav = useNavigate();

  useEffect(() => {
    fetch("/auth/me", { credentials: "include" })
      .then((response) => {
        if (response.status === 202) {
        } else {
          nav("/");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      });
  }, []);

  useEffect(() => {
    fetch("/auth/logout", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("isAuthenticated");
          nav("/");
        } else {
          console.error("Logout failed");
        }
      })
      .catch((error) => console.error("Error during logout:", error));
  }, [nav]);

  return <p>Logging out...</p>;
}

export default Logout;
