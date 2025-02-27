import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./../css/Register.css";
import { Link } from "react-router-dom";

const Register = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const userData = {
      ...data,
      role: {
        name: "Client",
        scopes: ["client"],
      },
    };
    postUser(userData);
  };

  const postUser = (data) => {
    fetch("/auth/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          nav("/login");
          alert("Registered Successfully!");
        } else {
          alert("Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="row">
      <div className="colm-logo">
        <Link to="/">
          <img src="/public/images/logo.jpg" alt="" />
        </Link>
      </div>
      <div className="colm-form">
        <div className="form-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <input
              type="text"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            <input
              type="text"
              placeholder="Phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{9,15}$/,
                  message: "Invalid phone number",
                },
              })}
            />
            {errors.phone && <p className="error">{errors.phone.message}</p>}

            <input
              type="text"
              placeholder="Address"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="error">{errors.address.message}</p>
            )}

            <input
              type="text"
              placeholder="Postal Code"
              {...register("postalCode", {
                required: "Postal Code is required",
                pattern: {
                  value: /^[0-9]{4,8}$/,
                  message: "Invalid postal code",
                },
              })}
            />
            {errors.postalCode && (
              <p className="error">{errors.postalCode.message}</p>
            )}

            <button className="botao3" type="submit">
              Create account
            </button>
          </form>

          <Link to="/login">
            <p>Already have an account? Login here!</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
