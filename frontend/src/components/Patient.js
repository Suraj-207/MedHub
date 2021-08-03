import React from "react";
import './Patient.css'

const Patient = (props) => {

  const handleChange = (e) => {
    props.onFieldChange(e);
  }

  return (
    <div className="patient">
      <div className="patient-signup">
        <input
          type="text"
          className="input_elements"
          name="city"
          placeholder="City"
          onChange={handleChange}
        />
      </div>
      <div className="patient-signup">
        <input
          type="text"
          className="input_elements"
          name="state"
          placeholder="State"
          onChange={handleChange}
        />
      </div>
      <div className="patient-signup">
        <input
          type="text"
          className="input_elements"
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
        />
      </div>
      <div className="patient-signup">
        <input
          type="text"
          className="input_elements"
          name="phoneno"
          placeholder="Phone no"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Patient;
