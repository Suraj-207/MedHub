import React from "react";
import'./Doctor.css'
import Input from "../shared/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../shared/util/validators";
import { useForm } from "../shared/hooks/form-hook";
 
const Doctor = (props) => {
  const [formState, inputHandler, setFormData] = useForm(
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
  );

  const handleChange = (e) => {
    props.onFieldChange(e);
  }


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
          name="experience"
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
          // element="input"
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
  );
};

export default Doctor
