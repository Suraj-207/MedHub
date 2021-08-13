import React, { useState, useContext } from "react";
import logincover from "../shared/UIComponent/logincover.png";
import "./Login.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../shared/context/AuthContext";
import LoadingSpinner from "../shared/UIComponent/LoadingSpinner";

const Login = () => {
  const [formData, setFormData] = useState({email: null, password: null});
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState();
  const auth = useContext(AuthContext);
  let fetchData;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
        fetchData = async () => {
          setLoad(true)
          const data = { formData };
          const response = await fetch("https://localhost:5000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          if(result == null){
            console.log("token problem")
          }else{
            auth.login(result.user, result.token);
          }
          setDetails(result);
          if (response.ok) {
            setLoad(false);
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
      <div>{load && <LoadingSpinner asOverlay />} </div>
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
              {details && <div> <center className="message">{details.message}</center>  </div>}
              <Link to="/forgot"><center className="forgot_password">Forgot password?</center></Link>
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
