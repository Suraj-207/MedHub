import React, { useState } from "react";
import logincover from "../shared/UIComponent/logincover.png";
import "./Login.css";
import { Link } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState("");
  let fetchData;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    try {
        fetchData = async () => {
          const data = { formData };
          console.log(formData.email);
          const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(result);
          if (response.ok) {
            console.log("done");
          }
        };
      } catch (err) {
        console.log(err);
      }
      fetchData();
  };
  return (
    <div className="login">
      <div className="login_cover">
        <img className="logo" src={logincover} alt="theme" />
      </div>

      <div className="wrap">
        <div className="heading">
          <h1>Welcome to MedHub</h1>
        </div>

        <div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="email@example.com"
                name="email"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <button className="form-button" type="submit">
                Login
              </button>
              <p>Forgot password?</p>
            </div>
          </form>
          <Link to="/signup">
            <button className="form-button">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
