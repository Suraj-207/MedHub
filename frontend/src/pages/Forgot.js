import React, { useState } from "react";
import Button from "../shared/FormElements/Button";
import Input from "../shared/FormElements/Input";
import { useForm } from "../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
} from "../shared/util/validators";
import LoadingSpinner from "../shared/UIComponent/LoadingSpinner";
import "./Forgot.css";
import { useHistory } from "react-router";

const Forgot = () => {
  const [formState, inputHandler] = useForm({
    email: "",
    otp: "",
    setpassword: ""
  });
  const [load, setLoad] = useState(false);
  const [otp, setOtp] = useState({});
  const [valid, checkValid] = useState(false);
  const history = useHistory();

  const checkValidHandler = () => {
    if (formState.inputs.otp.value === String(otp.otp)) {
      checkValid(true);
    } else {
      checkValid(false);
    }
  };

  const confirmOtp = () => {
    let fetchData;

    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          email: formState.inputs.email.value,
          password: formState.inputs.setpassword.value,
        };
        const response = await fetch(
          "/api/set-password",
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
        if (result == null) {
          console.log("token problem");
        } else {
          history.push("/");
        }

        if (response.ok) {
          setLoad(false);
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  };

  const otpHandler = () => {
    let fetchData;
    console.log(formState.inputs.email.value);
    try {
      fetchData = async () => {
        setLoad(true);
        const data = { email: formState.inputs.email.value };
        const response = await fetch("/api/otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log(result);
        if (result == null) {
          console.log("token problem");
        } else {
          setOtp(result);
        }
        console.log(typeof result.otp);
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

  return (
    <div className="details">
      <p>Please enter your details to reset password</p>  
      <div>{load && <LoadingSpinner asOverlay />} </div>
      <div className="center">
        <Input
          element="input"
          label="Email"
          type="text"
          className="input_elements"
          id="email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter valid email"
          onInput={inputHandler}
        />
      </div>
      <div className="center">
        {formState.inputs.email.isValid && (
          <Button onClick={otpHandler}> Submit </Button>
        )}
      </div>

      {otp.valid && (
        <div className="center">
          <Input
            element="input"
            label="OTP"
            type="text"
            className="input_elements"
            id="otp"
            validators={[VALIDATOR_MAXLENGTH(6), VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter valid otp"
            onInput={inputHandler}
          />
        </div>
      )}
      {otp.valid && (
        <div className="center">
          <Button
            disabled={!formState.inputs.otp.isValid}
            onClick={checkValidHandler}
          >
            Confirm OTP
          </Button>
        </div>
      )}
      {valid && (
        <div className="center">
          <div>
            <Input
              element="input"
              label="Set Password"
              type="password"
              className="input_elements"
              id="setpassword"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter valid password of length atleast 6"
              onInput={inputHandler}
            />
          </div>
          <div>
            <Button
              onClick={confirmOtp}
              disabled={!formState.inputs.setpassword.isValid}
            >
              Set Password
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forgot;
