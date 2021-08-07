import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";
import "./ConfirmBooking.css";
import DateTimePicker from "react-datetime-picker";

const ConfirmBooking = () => {
  const { props } = useLocation();
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState();
  const [value, onChange] = useState(new Date());
  const auth = useContext(AuthContext);
  let maxDate, year, month, date;

  const manageDate = (result) => {
    console.log(result.length - 1);
    const ndate = result[result.length - 1].start;
    maxDate = ndate.split("T")[0].split("-");
    year = maxDate[0];
    month = +maxDate[1];
    date = +maxDate[2];
    console.log(month);
  };
  const handleClick = () => {
    console.log(value);
  };
  useEffect(() => {
    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token, email: props.referrer };
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
          // setErr(true);
          setLoad(false);
          console.log("unidentified token");
        } else {
          //auth.login(result.user, result.token);
          console.log(result);
          setDetails(result);
          manageDate(result);
          console.log("done");
          //   setDetailsHandler(result);
          setLoad(false);
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
    <div className="confirm">
      <div>{load && <LoadingSpinner asOverlay />} </div>
      {details && (
        <React.Fragment>
          <div className="card">
            <div className="confirm_form">
              <h3>
                Confirm your booking with Dr. {details[0].fname}{" "}
                {details[0].lname}
              </h3>
            </div>
            <div className="confirm_form">
              <p>
                Dr {details[0].fname} conducts one session of{" "}
                {details[0].session} hour.
              </p>
            </div>
            <div className="confirm_form">
              <p>Please confirm your slot.</p>
              <DateTimePicker
                onChange={onChange}
                value={value}
                onClickDay={handleClick}
                minDate={new Date()}
                maxDate={new Date(details[details.length - 1].start)}
                disableClock={true}
              />
            </div>
          </div>
        </React.Fragment>
      )}

      {/* <h1>{props}</h1> */}
    </div>
  );
};

export default ConfirmBooking;
