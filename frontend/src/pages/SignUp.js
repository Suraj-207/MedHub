import React, { useState } from "react";
import "./SignUp.css";
import Doctor from "../components/Doctor";
import Patient from "../components/Patient";

const SignUp = () => {
  const [dropdown, setDropdown] = useState("");
  const [formData, updateFormData] = useState("");
  let fetchData;

  const handleDropdownChange = (e) => {
    console.log(typeof e.target.value);
    setDropdown(e.target.value);
  };

  const handleFieldChange = (e) => {
    updateFormData({
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
        const response = await fetch("http://localhost:5000/api/signup", {
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
    <React.Fragment>
      <div className="heading">
        <h1>SignUp</h1>
      </div>
      <div className="form">
        <div className="form-left">
          <div className="signup">
            <input
              type="text"
              className="input_elements"
              name="fname"
              placeholder="First name"
              onChange={handleFieldChange}
            />
          </div>
          <div className="signup">
            <input
              type="text"
              className="input_elements"
              name="lname"
              placeholder="last name"
              onChange={handleFieldChange}
            />
          </div>
          <div className="signup">
            <input
              type="text"
              className="input_elements"
              name="email"
              placeholder="E-mail"
              onChange={handleFieldChange}
            />
          </div>
          <div className="signup">
            <input
              type="text"
              className="input_elements"
              name="password"
              placeholder="Password"
              onChange={handleFieldChange}
            />
          </div>
          <div className="signup">
            <input
              type="text"
              className="input_elements"
              name="confirmpassword"
              placeholder="Confirm password"
            />
          </div>
        </div>
        <div className="form-right">
          <div className="proffession">
            <select name="account" onChange={handleFieldChange} onClick={handleDropdownChange} >
              <option value="">--Please choose an option--</option>
              <option name="account" value="doctor" >
                Doctor
              </option>
              <option name="account" value="patient" >
                Patient
              </option>
            </select>
          </div>
          <div>
            {dropdown === "doctor" && (
              <Doctor onFieldChange={handleFieldChange} />
            )}
          </div>
          <div>
            {dropdown === "patient" && (
              <Patient onFieldChange={handleFieldChange} />
            )}{" "}
          </div>
        </div>
      </div>
      <div className="signup-button">
        <button onClick={handleSubmit}>Confirm SignUp</button>
      </div>
    </React.Fragment>
  );
};

export default SignUp;
