import React from "react";
import './Patient.css'
import Input from "../shared/FormElements/Input";
import { VALIDATOR_MAXLENGTH, VALIDATOR_REQUIRE } from "../shared/util/validators";
import { useForm } from "../shared/hooks/form-hook";


const Patient = (props) => {
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
  )

  const handleChange = (e) => {
    props.onFieldChange(e);
  }

  return (
    <div className="patient">
      <div className="patient-signup">
        <Input
          type="text"
          label="City"
          element="input"
          className="input_elements"
          name="city"
          placeholder="City"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter your city"
          onInput={inputHandler}
          onChange={handleChange}
        />
      </div>
      <div className="patient-signup">
        <Input
          type="text"
          element="input"
          className="input_elements"
          name="state"
          placeholder="State"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter your state"
          onInput={inputHandler}
          onChange={handleChange}
        />
      </div>
      <div className="patient-signup">
        <Input
          element="input"
          type="number"
          className="input_elements"
          name="pin"
          placeholder="Pincode"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter your pincode"
          onInput={inputHandler}
          onChange={handleChange}
        />
      </div>
      <div className="patient-signup">
        <Input
          type="text"
          element="input"
          className="input_elements"
          name="phone"
          placeholder="Phone no"
          validators={[VALIDATOR_MAXLENGTH(10)]}
          errorText="Phone no must be 10 digts"
          onInput={inputHandler}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Patient;
