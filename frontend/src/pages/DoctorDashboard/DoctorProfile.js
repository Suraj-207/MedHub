import React, { useState } from "react";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const [dropdown, setDropdown] = useState();

  const handleFieldChange = () => {};

  const handleSubmit = () => {};

  const handleDropdownChange = () => {};
  return (
    <React.Fragment>
      <div className="heading">
        <h1>doctor_profile</h1>
      </div>
      <div className="form">
        <div className="form-left">
          <div className="doctor_profile">
            <input
              type="text"
              className="input_elements"
              name="fname"
              placeholder="First name"
            />
          </div>
          <div className="doctor_profile">
            <input
              type="text"
              className="input_elements"
              name="lname"
              placeholder="last name"
            />
          </div>
          <div className="doctor_profile">
            <input
              type="text"
              className="input_elements"
              name="email"
              placeholder="E-mail"
            />
          </div>
          <div className="doctor_profile">
            <input
              type="text"
              className="input_elements"
              name="speciality"
              placeholder="speciality"
              onChange={handleFieldChange}
            />
          </div>
          <div className="doctor_profile">
            <input
              type="text"
              className="input_elements"
              name="experience"
              placeholder="experience"
            />
          </div>
          <div className="doctor_profile">
            <input
              type="text"
              className="input_elements"
              name="place_of_work"
              placeholder="place of work"
            />
          </div>
        </div>
        <div className="form-right">
          <div className="proffession">
            <label>Start time </label>
            <input
              type="time"
              className="input_elements"
              name="start_time"
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>End time </label>
            <input
              type="time"
              className="input_elements"
              name="end_time"
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>Time/per session </label>
            <input
              type="time"
              className="input_elements"
              name="end_time"
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>Break start time </label>
            <input
              type="time"
              className="input_elements"
              name="break_start_time"
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>Break End time</label>
            <input
              type="time"
              className="input_elements"
              name="break_end_time"
              //   placeholder="place of work"
            />
          </div>
        </div>
      </div>
      <div className="doctor_profile_button">
        <button onClick={handleSubmit}>Confirm Changes</button>
      </div>
    </React.Fragment>
  );
};

export default DoctorProfile;
