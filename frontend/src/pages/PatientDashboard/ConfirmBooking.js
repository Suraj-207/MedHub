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
  const [slotStatus, setSlotStatus] = useState(false);
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
      setLoad(true);
      fetchData = async () => {
        const data = {
          token: auth.token,
          doctor_email: props.email,
          date: fullDate,
          issue: formState.inputs.issue.value,
          time: slot,
        };
        const response = await fetch(
          "https://localhost:5000/api/book-slot",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        if (result === null || result === false ) {
          setLoad(false);
          console.log("unidentified token");
        } else {
          console.log(result);
          console.log("done");
          window.location.href = result;
          // window.open({result},"target_blank");
        }
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
      setLoad(true)
      fetchData = async () => {
        const data = { token: auth.token, email: props.email, date: newDate };
        const response = await fetch(
          "https://localhost:5000/api/fetch-na-appointments",
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
          setLoad(false)
        }
        if (response.ok) {
          setLoad(false)
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
            <p>Confirm your booking with Dr. {props.fname}</p>
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
          {details && details.length>0 && <p>Each appointment is of {details[0].session}</p>}
          <div className="slot_time" onClick={fieldHandler}>
            {details && details.length>0 &&
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
              })}
          </div>
          <div>{details && details.length === 0 && <p>Sorry, no slots available</p>}</div>
          <div>{status && <p>You selected {slot} slot. </p>}</div>
          {status && slot && (
            <div className="confirm_handle">
              <Button onClick={confirmBookingHandler}> Cofirm booking</Button>
            </div>
          )}
        </div>
      </React.Fragment>
    </div>
  );
};

export default ConfirmBooking;
