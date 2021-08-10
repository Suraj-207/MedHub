import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import Input from "../../shared/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/FormElements/Button";
import "./PatientProfile.css"

const PatientProfile = () => {
  const [details, setDetails] = useState({});
  const [load, setLoad] = useState(true);
  const [formState, inputHandler] = useForm();
  const auth = useContext(AuthContext);
  let data, fetchData;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          token: auth.token,
          changes: {
            phone: formState.inputs.phone.value,
            state: formState.inputs.state.value,
            city: formState.inputs.city.value,
            pin: formState.inputs.pin.value,
          },
        };
        console.log(data);
        const response = await fetch(
          "http://localhost:5000/api/change-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        console.log(result);
        if (response.ok) {
          setLoad(false);
          console.log("done");
          window.location.reload();
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();

    console.log(data);
  };

  const setDetailsHandler = (result) => {
    setDetails(result);
    setLoad(false);
  };

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token };
        const response = await fetch(
          "http://localhost:5000/api/fetch-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        if (result === null) {
          console.log("unidentified token");
        } else {
          setDetailsHandler(result);
        }
        if (response.ok) {
          console.log("done");
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  }, [auth.token]);

  return (
    <React.Fragment>
      <div className="heading">
        <h1>doctor_profile</h1>
      </div>
      <div>{load && <LoadingSpinner asOverlay />} </div>
      {!load && details && (
        <div className="patient_form">
          <div className="patient_form-left">
            <div className="patient_profile">
              <h4>Firstname:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.fname : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Lastname:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.lname : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Email:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.email : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Gender:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.gender : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Phone:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="phone"
                  validators={[
                    VALIDATOR_MAXLENGTH(10),
                    VALIDATOR_MINLENGTH(10),
                  ]}
                  errorText="Please enter correct phone no"
                  onInput={inputHandler}
                  initialValue={details.phone}
                  initialValid={true}
                />
              </div>
            </div>
            <div className="patient_profile">
              <h4>City:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="city"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your city"
                  name="city"
                  initialValue={details.city}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
            <div className="patient_profile">
              <h4>State:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="state"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your state"
                  onInput={inputHandler}
                  initialValue={details.state}
                  initialValid={true}
                />
              </div>
            </div>
            <div className="patient_profile">
              <h4>Pin:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  name="pin"
                  id="pin"
                  validators={[VALIDATOR_MAXLENGTH(6), VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter correct pin"
                  initialValue={details.pin}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="patient_profile_button">
        <Button onClick={handleSubmit} type="submit" disabled={!formState.isValid}>
            {"Confirm changes"}
          </Button>
      </div>
    </React.Fragment>
  );
};

export default PatientProfile;
