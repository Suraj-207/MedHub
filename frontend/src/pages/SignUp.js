import React, { useState } from "react";
import "./SignUp.css";
import Doctor from "../components/Doctor";
import Patient from "../components/Patient";

const SignUp = () => {
  const [dropdown, setDropdown] = useState("");
  const [formData, updateFormData] = useState("");

  const handleDropdownChange = (e) => {
    console.log(typeof e.target.value);
    setDropdown(e.target.value);
  };

  const handleFieldChange = (e) => {
    updateFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
  }

  const handleSubmit = () => {
      console.log(formData)
  }

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
              name="firstname"
              placeholder="First name"
              onChange={handleFieldChange}
            />
          </div>
          <div className="signup">
            <input
              type="text"
              className="input_elements"
              name="lastname"
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
              onChange={handleFieldChange}
            />
          </div>
        </div>
        <div className="form-right">
          <div className="proffession">
            <select name="doctor" onClick={handleDropdownChange}>
              <option value="">--Please choose an option--</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <div>{dropdown === "doctor" && <Doctor onFieldChange={handleFieldChange} />}</div>
          <div>{dropdown === "patient" && <Patient onFieldChange={handleFieldChange} />} </div>
        </div>
      </div>
      <div className="signup-button">
        <button onClick={handleSubmit} >Confirm SignUp</button>
      </div>
    </React.Fragment>
  );
};

export default SignUp;
