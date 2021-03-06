import React from "react";
import'./Doctor.css'
import Input from "../shared/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../shared/util/validators";
import { useForm } from "../shared/hooks/form-hook";
 

/* Doctor component  */
const Doctor = () => {
  const [inputHandler] = useForm();
  return (
    <div className="doctor">
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
          placeholder="Acting medical professional proof"
          errorText="Please enter link of your professional proof"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
      </div>
    </div>
  );
};

export default Doctor
