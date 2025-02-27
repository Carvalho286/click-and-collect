import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./../css/Login.css";

function Login() {
  document.title = "Login";

  const nav = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Submitting data:", data);
    postUser(data);
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
          nav("/");
        } else {
          alert("Wrong email or password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="row">
        <div className="colm-logo">
          <Link to="/">
            <img src="/public/images/logo.jpg" alt="" />
          </Link>
        </div>
        <div className="colm-form">
          <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type="text" placeholder="Email" {...register("email")} />
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              <button className="botao" type="submit">
                Login
              </button>
            </form>
            <p>Forgot Password?</p>
            <Link to="/register">
              <button className="botao2">Create an account</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
