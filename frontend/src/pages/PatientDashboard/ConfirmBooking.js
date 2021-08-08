import React, { useEffect, useState, useContext } from "react";
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
  const [value, onChange] = useState(new Date());
  const [formState, inputHandler, setFormData] = useForm();
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
  const handleSubmit = () => {
    const month = parseInt(value.toLocaleDateString().split("/")[0])
    const date = parseInt(value.toLocaleDateString().split("/")[1])
    const year = parseInt(value.toLocaleDateString().split("/")[2])
    const fullDate = `${year}-${month<10? 0:""}${month}-${date<10? 0:""}${date}`
    console.log(formState.inputs.issue.value)
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token, email: props.email, date: fullDate };
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
          if (result) {
            console.log("1");

          }
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
  // useEffect(() => {
  //   setLoad(true);
  //   let fetchData;
  //   try {
  //     fetchData = async () => {
  //       const data = { token: auth.token, email: props.referrer };
  //       const response = await fetch(
  //         "http://localhost:5000/api/fetch-na-appointments",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(data),
  //         }
  //       );
  //       const result = await response.json();
  //       if (result === null) {
  //         // setErr(true);
  //         setLoad(false);
  //         console.log("unidentified token");
  //       } else {
  //         //auth.login(result.user, result.token);
  //         console.log(result);
  //         setDetails(result);
  //         manageDate(result);
  //         console.log("done");
  //         //   setDetailsHandler(result);
  //         setLoad(false);
  //       }
  //       if (response.ok) {
  //         console.log("done");
  //       }
  //     };
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   fetchData();
  // }, [auth.token]);
  return (
    <div className="confirm">
      <div>{load && <LoadingSpinner asOverlay />} </div>
        <React.Fragment>
          <div className="card">
            <div className="confirm_form">
              <h3>
                Confirm your booking with Dr. {props.fname}
              </h3>
            </div>
            {/* <div className="confirm_form">
              <p>
                Dr {props.fname} conducts one session of{" "}
                {details[0].session} hour.
              </p>
            </div> */}
            <div className="confirm_form">
              <Input
                placeholder="Please mention your issue here"
                label="Medical issue"
                onInput={inputHandler}
                id="issue"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please fill the above field"
              />
            </div>
            <div className="confirm_form">
              <p>Please confirm your slot.</p>
              <DatePicker
                onChange={onChange}
                value={value}
                minDate={new Date()}
                format="y-MM-dd"
                // maxDate={new Date(details[details.length - 1].start)}
                // disableClock={true}
              />
            </div>
            <div>
              <Button onClick={handleSubmit} disabled={!formState.isValid}  >
                Confirm
              </Button>
            </div>
          </div>
        </React.Fragment>

      {/* <h1>{props}</h1> */}
    </div>
  );
};

export default ConfirmBooking;
