import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import "./DoctorProfile.css";


const DoctorProfile = () => {
  const [dropdown, setDropdown] = useState();
  const [formData, updateFormData] = useState();
  const auth = useContext(AuthContext);
  let data;

  const handleFieldChange = (e) => {
    updateFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
  };

  const handleSubmit = (e) => {
      data = {
          token : auth.token,
          changes: formData
      }
      console.log(data);
  };

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
          const data = {token: auth.token};
          const response = await fetch(
            "http://localhost:5000/api/fetch-profile",
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
            console.log("unidentified token");
          } else {
            auth.login(result.user, result.token);
            console.log(result);
          }
          if (response.ok) {
            console.log("done");
          }
        }
    } catch (err) {
      console.log(err);
    }
    fetchData();
  }, []);

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
              onChange={handleFieldChange}
            />
          </div>
          <div className="doctor_profile">
            <input
              type="text"
              className="input_elements"
              name="place_of_work"
              placeholder="place of work"
              onChange={handleFieldChange}
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
              onChange={handleFieldChange}
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>End time </label>
            <input
              type="time"
              className="input_elements"
              name="end_time"
              onChange={handleFieldChange}
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>Time/per session </label>
            <input
              type="time"
              className="input_elements"
              name="end_time"
              onChange={handleFieldChange}
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>Break start time </label>
            <input
              type="time"
              className="input_elements"
              name="break_start_time"
              onChange={handleFieldChange}
              //   placeholder="place of work"
            />
          </div>
          <div className="proffession">
            <label>Break End time</label>
            <input
              type="time"
              className="input_elements"
              name="break_end_time"
              onChange={handleFieldChange}
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
