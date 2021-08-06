import React, { useState, useContext } from "react";
import "./SignUp.css";
// import Doctor from "../components/Doctor";
// import Patient from "../components/Patient";
import { AuthContext } from "../shared/context/AuthContext";
import { useHistory } from "react-router-dom";
import Input from "../shared/FormElements/Input";
import { useForm } from "../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../shared/util/validators";

const SignUp = () => {
  const [dropdown, setDropdown] = useState("");
  const [formData, updateFormData] = useState("");
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm();
  // {
  //   email: {
  //     value: "",
  //     isValid: false,
  //   },
  //   password: {
  //     value: "",
  //     isValid: false,
  //   },
  // },
  // false
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
    if (dropdown === "doctor") {
      try {
        fetchData = async () => {
          const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fname: formState.inputs.firstname.value,
              lname: formState.inputs.lastname.value,
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
              account:formData.account,
              speciality:formState.inputs.speciality.value,
              experience: formState.inputs.experience.value,
              place_of_work: formState.inputs.place_of_work.value,
              proof: formState.inputs.proof.value
            }),
          });
          const result = await response.json();
          auth.login(result.user, result.token);
          console.log(result);
          if (response.ok) {
            console.log("done");
            history.push("/");
          }
        };
      } catch (err) {
        console.log(err);
      }
    }else{
      try {
        fetchData = async () => {
          const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fname: formState.inputs.firstname.value,
              lname: formState.inputs.lastname.value,
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
              account:formData.account,
              city:formState.inputs.city.value,
              state: formState.inputs.state.value,
              phone: formState.inputs.phone.value,
              pin: formState.inputs.pin.value
            }),
          });
          const result = await response.json();
          auth.login(result.user, result.token);
          console.log(result);
          if (response.ok) {
            console.log("done");
            history.push("/");
          }
        };
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  };

  return (
    <React.Fragment>
      <div className="heading">
        <h1>SignUp</h1>
      </div>
      <div className="proffession">
        <select
          name="account"
          onChange={handleFieldChange}
          onClick={handleDropdownChange}
        >
          <option value="">--Please choose an option--</option>
          <option name="account" value="doctor">
            Doctor
          </option>
          <option name="account" value="patient">
            Patient
          </option>
        </select>
      </div>
      {dropdown === "doctor" && (
        <div className="form">
          <div className="form-left">
            <div className="signup">
              <Input
                element="input"
                id="firstname"
                type="text"
                label="First name"
                placeholder="First name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your first name."
                onInput={inputHandler}
              />
            </div>
            <div className="signup">
              <Input
                element="input"
                id="lastname"
                type="text"
                label="Last name"
                placeholder="Last name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your last name."
                onInput={inputHandler}
              />
            </div>
            <div className="signup">
              <Input
                type="email"
                element="input"
                label="E-mail"
                id="email"
                placeholder="E-mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />
            </div>
            <div className="signup">
              <Input
                element="input"
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
            </div>
          </div>
          <div className="form-right">
            <div className="doctor-signup">
              <Input
                element="input"
                id="speciality"
                type="text"
                className="input_elements"
                label="Speciality"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your speciality"
                placeholder="speciality"
                onInput={inputHandler}
              />
            </div>
            <div className="doctor-signup">
              <Input
                element="input"
                id="experience"
                label="Experience"
                type="number"
                className="input_elements"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your experience"
                placeholder="experience"
                onInput={inputHandler}
              />
            </div>
            <div className="doctor-signup">
              <Input
                type="text"
                label="Place of work"
                id="place_of_work"
                className="input_elements"
                placeholder="Place Of Work"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your place of work"
                onInput={inputHandler}
              />
            </div>
            <div className="doctor-signup">
              <Input
                label="Acting professional proof"
                id="proof"
                type="link"
                className="input_elements"
                name="proof"
                placeholder="Acting medical professional proof"
                errorText="Please enter link of your professional proof"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
              />
            </div>
          </div>
        </div>
      )}
      {dropdown === "patient" && (
        <div className="form">
          <div className="form-left">
            <div className="signup">
              <Input
                element="input"
                id="firstname"
                type="text"
                label="First name"
                placeholder="First name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your first name."
                onInput={inputHandler}
              />
            </div>
            <div className="signup">
              <Input
                element="input"
                id="lastname"
                type="text"
                label="Last name"
                placeholder="Last name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your last name."
                onInput={inputHandler}
              />
            </div>
            <div className="signup">
              <Input
                type="email"
                element="input"
                label="E-mail"
                id="email"
                placeholder="E-mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />
            </div>
            <div className="signup">
              <Input
                element="input"
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
            </div>
          </div>
          <div className="form-right">
            <div className="doctor-signup">
              <Input
                element="input"
                id="city"
                type="text"
                className="input_elements"
                label="City"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your city"
                placeholder="city"
                onInput={inputHandler}
              />
            </div>
            <div className="doctor-signup">
              <Input
                element="input"
                id="state"
                label="State"
                type="text"
                className="input_elements"
                name="State"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your state"
                placeholder="state"
                onInput={inputHandler}
              />
            </div>
            <div className="doctor-signup">
              <Input
                element="input"
                type="text"
                label="Phone no"
                id="phone"
                className="input_elements"
                placeholder="Phone no"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your phone no"
                onInput={inputHandler}
              />
            </div>
            <div className="doctor-signup">
              <Input
                element="input"
                label="Pincode"
                id="pin"
                type="link"
                className="input_elements"
                placeholder="Pincode"
                errorText="Please enter your pincode"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
              />
            </div>
          </div>
        </div>
      )}
      <div className="signup-button">
        <button onClick={handleSubmit}>Confirm SignUp</button>
      </div>
    </React.Fragment>
  );
};

export default SignUp;
