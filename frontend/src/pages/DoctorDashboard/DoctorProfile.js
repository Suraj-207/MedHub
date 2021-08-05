import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import "./DoctorProfile.css";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";

const DoctorProfile = () => {
  // const [dropdown, setDropdown] = useState();
  const [formData, updateFormData] = useState();
  const [details, setDetails] = useState({});
  const [load, setLoad] = useState(true);
  const auth = useContext(AuthContext);
  let data, fetchData;

  const handleFieldChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
        fetchData = async () => {
          setLoad(true)
          const data = {token: auth.token, changes: formData}
          console.log(data); 
          const response = await fetch("http://localhost:5000/api/change-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(result);
          if (response.ok) {
            setLoad(false);
            console.log("done");
            window.location.reload();
          }
        };
      } catch (err) {
        console.log(err);
      }
      fetchData();

    console.log(data);
  };

  const setDetailsHandler = (result) => {
    console.log(Object.keys(result).length);
    setDetails(result);
    setLoad(false);
  };

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token };
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
          //auth.login(result.user, result.token);
          console.log(result);
          setDetailsHandler(result);
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

  // const handleDropdownChange = () => {};
  return (
    <React.Fragment>
      <div className="heading">
        <h1>doctor_profile</h1>
      </div>
      <div>{load && <LoadingSpinner asOverlay />} </div>
      <div className="form">
        <div className="form-left">
          <div className="doctor_profile">
          <h4>Firstname:</h4>
          <label>{Object.keys(details).length > 0 ? details.fname : ""}</label>
          </div>
          <div className="doctor_profile">
          <h4>Lastname:</h4>
          <label>{Object.keys(details).length > 0 ? details.lname : ""}</label>
          </div>
          <div className="doctor_profile">
          <h4>Email:</h4>
          <label>{Object.keys(details).length > 0 ? details.email : ""}</label>
          </div>
          <div className="doctor_profile">
          <h4>Speciality:</h4>
          <div>
          <input
              type="text"
              className="input_elements"
              name="speciality"
              placeholder={
                Object.keys(details).length > 0 ? details.speciality : ""
              }
              onChange={handleFieldChange}
            />
          </div>
            
          </div>
          <div className="doctor_profile">
          <h4>Experience:</h4>
          <div>
          <input
              type="number"
              className="input_elements"
              name="experience"
              placeholder={
                Object.keys(details).length > 0 ? details.experience : ""
              }
              onChange={handleFieldChange}
            />
          </div>
            
          </div>
          <div className="doctor_profile">
          <h4>Place Of Work:</h4>
          <div>
          <input
              type="text"
              className="input_elements"
              name="pow"
              placeholder={Object.keys(details).length > 0 ? details.pow : ""}
              onChange={handleFieldChange}
            />
          </div>
            
          </div>
        </div>
        <div className="form-right">
          <h4>Start time </h4>
          <div className="details_time">
            <div>
              <label>
                {Object.keys(details).length > 0
                  ? details.start_time
                  : "Not Set"}
              </label>
            </div>
            <div>
              <input
                type="time"
                className="input_elements"
                name="start_time"
                onChange={handleFieldChange}
                // placeholder={Object.keys(details).length> 0 ? details.start_time : ""}
                placeholder="10:53"
              />
            </div>
          </div>
          <h4>End time </h4>
          <div className="details_time">
            <div>
              <label>
                {Object.keys(details).length > 0 ? details.end_time : "Not Set"}
              </label>
            </div>
            <div>
              <input
                type="time"
                className="input_elements"
                name="end_time"
                onChange={handleFieldChange}
                placeholder={
                  Object.keys(details).length > 0 ? details.end_time : ""
                }
              />
            </div>
          </div>
          <h4>Time/per session </h4>
          <div className="details_time">
            <div>
              <label>
                {Object.keys(details).length > 0 ? details.session : "Not Set"}
              </label>
            </div>
            <div>
              <input
                type="time"
                className="input_elements"
                name="session"
                onChange={handleFieldChange}
                placeholder={
                  Object.keys(details).length > 0 ? details.session : ""
                }
              />
            </div>
          </div>
          <h4>Break start time </h4>
          <div className="details_time">
            <div>
              <label>
                {Object.keys(details).length > 0
                  ? details.break_start
                  : "Not Set"}
              </label>
            </div>
            <div>
              <input
                type="time"
                className="input_elements"
                name="break_start"
                onChange={handleFieldChange}
                placeholder={
                  Object.keys(details).length > 0 ? details.break_start : ""
                }
              />
            </div>
          </div>
          <h4>Break End time</h4>
          <div className="details_time">
            <div>
              <label>
                {Object.keys(details).length > 0
                  ? details.break_end
                  : "Not Set"}
              </label>
            </div>
            <div>
              <input
                type="time"
                className="input_elements"
                name="break_end"
                onChange={handleFieldChange}
                placeholder={
                  Object.keys(details).length > 0 ? details.break_end : ""
                }
              />
            </div>
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
