import React, { useState, useContext } from "react";
import "./SignUp.css";
import { AuthContext } from "../shared/context/AuthContext";
import { useHistory } from "react-router-dom";
import Input from "../shared/FormElements/Input";
import {
  CountryDropdown,
  RegionDropdown,
} from "react-indian-state-region-selector";
import { useForm } from "../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../shared/util/validators";
import Button from "../shared/FormElements/Button";

const SignUp = () => {
  const [accountMode, setaccountMode] = useState(true);
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm();
  const [country, setCountry] = useState();
  const [region, setRegion] = useState();
  const [state, setState] = useState(false);
  let fetchData;

  const dropdownHandler = () => {
    if(region && country)
      setState(prev => !prev);

    console.log(1);
  };

  const switchModeHandler = () => {
    setaccountMode((prevMode) => !prevMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountMode) {
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
              account: "doctor",
              speciality: formState.inputs.speciality.value,
              experience: formState.inputs.experience.value,
              city: region,
              state: country,
              place_of_work: formState.inputs.place_of_work.value,
              proof: formState.inputs.proof.value,
            }),
          });
          const result = await response.json();

          console.log(result);
          if (response.ok) {
            console.log("done");
            auth.login(result.user, result.token);
            history.push("/");
          }
        };
      } catch (err) {
        console.log(err);
      }
    } else {
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
              account: "patient",
              city: region,
              state: country,
              phone: formState.inputs.phone.value,
              pin: formState.inputs.pin.value,
            }),
          });
          const result = await response.json();

          console.log(result);
          if (response.ok) {
            console.log("done");
            auth.login(result.user, result.token);
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
      <div className="center">
        <Button inverse onClick={switchModeHandler}>
          {" "}
          I am a {accountMode ? "Doctor" : "Patient"}{" "}
        </Button>
      </div>
      {accountMode && (
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
            <div className="doctor-signup-dropdown">
              <CountryDropdown
                className="state"
                value={country}
                onChange={setCountry}
                onBlur={dropdownHandler}
              />
            </div>
            <div className="doctor-signup-dropdown">
              <RegionDropdown
                blankOptionLabel="Please select a state first"
                country={country}
                value={region}
                onChange={setRegion}
                onBlur={dropdownHandler}
              />
            </div>
          </div>
        </div>
      )}
      {!accountMode && (
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
                type="text"
                label="Phone no"
                id="phone"
                className="input_elements"
                placeholder="Phone no"
                validators={[VALIDATOR_MAXLENGTH(10)]}
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
            <div className="doctor-signup-dropdown">
              <CountryDropdown value={country} onChange={setCountry} />
            </div>

            <div className="doctor-signup-dropdown">
              <RegionDropdown
                blankOptionLabel="Please select a state first"
                country={country}
                value={region}
                onChange={() => {
                  setRegion();
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="signup-button">
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={state ? !formState.isValid: true}
        >
          {"Confirm"}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default SignUp;
