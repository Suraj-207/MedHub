import React, { useState, useContext } from "react";
import { useLocation } from "react-router";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";
import "./ConfirmBooking.css";
import DatePicker from "react-date-picker";
import Input from "../../shared/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Button from "../../shared/FormElements/Button";

const ConfirmBooking = () => {
  const { props } = useLocation();
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState();
  const [fullDate, setFullDate] = useState();
  const [slot, setSlot] = useState("");
  const [status, setStatus] = useState(false);
  const [value, onChange] = useState(new Date());
  const [formState, inputHandler] = useForm();
  const auth = useContext(AuthContext);
  const theDate = new Date();
  const myNewDate = new Date(theDate);
  myNewDate.setDate(myNewDate.getDate() + 15);

  const fieldHandler = (e) => {
    setStatus(true);
    console.log(e.target.value);
    setSlot(e.target.value);
  };

  const inputChangeHandler = (e) => {
    console.log(e.target.value);
  };

  const confirmBookingHandler = () => {
    let fetchData;
    try {
      fetchData = async () => {
        const data = {
          token: auth.token,
          doctor_email: props.email,
          date: fullDate,
          issue: formState.inputs.issue.value,
          time: slot,
        };
        const response = await fetch(
          "http://localhost:5000/api/book-slot",
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
          setLoad(false);
          console.log("unidentified token");
        } else {
          console.log(result);
          if (result) {
            console.log("1");
          }
          console.log("done");
        }
        if (response.ok) {
          console.log("done");
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  };

  const handleSubmit = () => {
    const month = parseInt(value.toLocaleDateString().split("/")[0]);
    const date = parseInt(value.toLocaleDateString().split("/")[1]);
    const year = parseInt(value.toLocaleDateString().split("/")[2]);
    const newDate = `${year}-${month < 10 ? 0 : ""}${month}-${
      date < 10 ? 0 : ""
    }${date}`;
    setFullDate(newDate);
    console.log(formState.inputs.issue.value);
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token, email: props.email, date: newDate };
        const response = await fetch(
          "http://localhost:5000/api/fetch-na-appointments",
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
          setLoad(false);
          setDetails(result)
          console.log("unidentified token");
        } else {
          console.log(result);
          setDetails(result);
          console.log("done");
        }
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
    <div className="confirm">
      <div>{load && <LoadingSpinner asOverlay />} </div>
      <React.Fragment>
        <div className="card">
          <div className="confirm_form">
            <h3>Confirm your booking with Dr. {props.fname}</h3>
          </div>
          <div className="confirm_form">
            <Input
              placeholder="Please mention your issue here"
              label="Medical issue"
              onInput={inputHandler}
              id="issue"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please fill the above field"
              initialValid={true}
            />
          </div>
          <div className="confirm_form">
            <p>Please confirm your slot.</p>
            <DatePicker
              onChange={onChange}
              value={value}
              minDate={new Date()}
              maxDate={myNewDate}
              format="y-MM-dd"
            />
          </div>
          <div>
            <Button onClick={handleSubmit} disabled={!formState.isValid}>
              Check for slot
            </Button>
          </div>
          {details && details.length>0 && <h1>Each appointment is of {details[0].session}</h1>}
          <div className="slot_time" onClick={fieldHandler}>
            {details ?
              details.map((item, index) => {
                return (
                  <button
                    className="slot_time_button"
                    key={index}
                    onChange={inputChangeHandler}
                    value={item.start}
                  >
                    {item.start}
                  </button>
                );
              }): <p>No slots available for specified date.</p>}
          </div>
          <div>{status && <h1>You selected {slot} slot. </h1>}</div>
          {status && slot && (
            <div>
              <Button onClick={confirmBookingHandler}> Cofirm booking</Button>
            </div>
          )}
        </div>
      </React.Fragment>
    </div>
  );
};

export default ConfirmBooking;
