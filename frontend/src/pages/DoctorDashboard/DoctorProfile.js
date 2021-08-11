import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import "./DoctorProfile.css";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import ImageUpload from "../../shared/FormElements/ImageUpload";

const DoctorProfile = () => {
  const [details, setDetails] = useState({});
  const [load, setLoad] = useState(true);
  const auth = useContext(AuthContext);
  const [allValues, setAllValues] = useState({
    start_time: "",
    end_time: "",
    session: "",
    break_start: "",
    break_end: "",
  });

  const [formState, inputHandler] = useForm();
  let data, fetchData;

  const handleFieldChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(allValues);
    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          token: auth.token,
          changes: {
            start_time: allValues.start_time,
            end_time: allValues.end_time,
            break_start: allValues.break_start,
            break_end: allValues.break_end,
            session: allValues.session,
            speciality: formState.inputs.speciality.value,
            experience: formState.inputs.experience.value,
            pow: formState.inputs.pow.value,
          },
        };
        console.log(data);
        const response = await fetch(
          "https://localhost:5000/api/change-profile",
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
    console.log(Object.keys(result).length);
    setDetails(result);
    setLoad(false);
  };

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token };
        const response = await fetch(
          "https://localhost:5000/api/fetch-profile",
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
          console.log(result);
          setDetailsHandler(result);
          setAllValues({
            start_time: result.start_time,
            end_time: result.end_time,
            session: result.session,
            break_start: result.break_start,
            break_end: result.break_end,
          });
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
      {!load && (
        <div className="dashboard_form">
          <div className="dashboard_form-left">
            <div className="dashboard_doctor_profile">
              <h4>Firstname:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.fname : ""}
              </label>
            </div>
            <div className="dashboard_doctor_profile">
              <h4>Lastname:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.lname : ""}
              </label>
            </div>
            <div className="dashboard_doctor_profile">
              <h4>Email:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.email : ""}
              </label>
            </div>
            <div className="dashboard_doctor_profile">
              <h4>Speciality:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="speciality"
                  validators={[VALIDATOR_REQUIRE()]}
                  initialValue={details.speciality}
                  errorText="Please enter your speciality"
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
            <div className="dashboard_doctor_profile">
              <h4>Experience:</h4>
              <div>
                <Input
                  element="input"
                  type="number"
                  className="input_elements"
                  id="experience"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your experience in years"
                  initialValue={details.experience}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
            <div className="dashboard_doctor_profile">
              <h4>Place Of Work:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="pow"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your place of work"
                  initialValue={details.pow}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
            <div className="dashboard_doctor_profile">
              <h4>Gender:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="gender"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your place of work"
                  initialValue={details.gender}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
          </div>
          <div className="dashboard_form-right">
            <div className="side">
              <h4>Start time </h4>
              <div className="dashboard_details_time">
                <div className="time_input">
                  <label>
                    {Object.keys(details).length > 0
                      ? details.start_time
                      : "Not Set"}
                  </label>
                </div>
                <div className="time_input">
                  <input
                    type="time"
                    className="input_elements"
                    name="start_time"
                    onChange={handleFieldChange}
                    placeholder="10:53"
                  />
                </div>
              </div>
              <div className="time_head">
                <p>End time </p>
              </div>
              <div className="dashboard_details_time">
                <div className="time_input">
                  <label>
                    {Object.keys(details).length > 0
                      ? details.end_time
                      : "Not Set"}
                  </label>
                </div>
                <div className="time_input">
                  <input
                    type="time"
                    className="input_elements"
                    name="end_time"
                    onChange={handleFieldChange}
                    placeholder={
                      Object.keys(details).length > 0 ? details.end_time : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div className="side">
              <h4>Time/per session </h4>
              <div className="dashboard_details_time">
                <div className="time_input">
                  <label>
                    {Object.keys(details).length > 0
                      ? details.session
                      : "Not Set"}
                  </label>
                </div>
                <div className="time_input">
                  <input
                    type="time"
                    className="input_elements"
                    name="session"
                    onChange={handleFieldChange}
                    placeholder={
                      Object.keys(details).length > 0 ? details.session : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div className="side">
              <h4>Break start time </h4>
              <div className="dashboard_details_time">
                <div className="time_input">
                  <label>
                    {Object.keys(details).length > 0
                      ? details.break_start
                      : "Not Set"}
                  </label>
                </div>
                <div className="time_input">
                  <input
                    type="time"
                    className="input_elements"
                    name="break_start"
                    onChange={handleFieldChange}
                    placeholder={
                      Object.keys(details).length > 0 ? details.break_start : ""
                    }
                  />
                </div>
              </div>

              <div className="time_head">
                <p>Break end time </p>
              </div>
              <div className="dashboard_details_time">
                <div className="time_input">
                  <label>
                    {Object.keys(details).length > 0
                      ? details.break_end
                      : "Not Set"}
                  </label>
                </div>
                <div className="time_input">
                  <input
                    type="time"
                    className="input_elements"
                    name="break_end"
                    onChange={handleFieldChange}
                    placeholder={
                      Object.keys(details).length > 0 ? details.break_end : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div className="image-left">
              <div className="form-right-right">
                <div className="form-details">
                  <Input
                    element="input"
                    type="text"
                    label="City"
                    className="input_elements"
                    id="city"
                    validators={[VALIDATOR_REQUIRE()]}
                    // initialValue={details.account_number}
                    errorText="Please enter city"
                    initialValid={true}
                    onInput={inputHandler}
                  />
                </div>
                <div className="form-details">
                  <Input
                    element="input"
                    type="text"
                    label="State"
                    className="input_elements"
                    id="state"
                    validators={[VALIDATOR_REQUIRE()]}
                    // initialValue={details.account_number}
                    errorText="Please enter state"
                    initialValid={true}
                    onInput={inputHandler}
                  />
                </div>
                <div className="form-details">
                  <Input
                    element="input"
                    type="text"
                    label="Account Number"
                    className="input_elements"
                    id="account_number"
                    validators={[VALIDATOR_REQUIRE()]}
                    // initialValue={details.account_number}
                    errorText="Please enter your account number"
                    initialValid={true}
                    onInput={inputHandler}
                  />
                </div>
                <div className="form-details">
                  <Input
                    element="input"
                    label="IFSC Code"
                    type="text"
                    className="input_elements"
                    id="ifsc_code"
                    validators={[VALIDATOR_REQUIRE()]}
                    initialValue={details.ifsc}
                    errorText="Please enter your ifsc code"
                    initialValid={true}
                    onInput={inputHandler}
                  />
                </div>
                <div className="form-details">
                  <Input
                    element="input"
                    label="Amount charged per session"
                    type="text"
                    className="input_elements"
                    id="ammount"
                    validators={[VALIDATOR_REQUIRE()]}
                    initialValue={details.account}
                    errorText="Please enter proper ammount."
                    initialValid={true}
                    onInput={inputHandler}
                  />
                </div>
                <div>
                  <span
                    className={details.active ? "active_dot" : "inactive_dot"}
                  ></span>{" "}
                  {details.active
                    ? " Your account is active."
                    : " Complete your profile to activate your account."}
                </div>
              </div>
              <div className="form-right-right">
                <div className="form-details-image">
                  <ImageUpload
                    center
                    id="image"
                    onInput={inputHandler}
                    errorText="Please provide an image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="dashboard_doctor_profile_button">
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={!formState.isValid}
        >
          {"Confirm"}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default DoctorProfile;
