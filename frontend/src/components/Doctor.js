import React from "react";
import'./Doctor.css'
const Doctor = (props) => {
  // const [fields, setFields] = useState("");

  const handleChange = (e) => {
    props.onFieldChange(e);
  }


  return (
    <div className="doctor">
      <div className="doctor-signup">
        <input
          type="text"
          className="input_elements"
          name="speciality"
          placeholder="speciality"
          onChange={handleChange}
        />
      </div>
      <div className="doctor-signup">
        <input
          type="number"
          className="input_elements"
          name="experience"
          placeholder="experience"
          onChange={handleChange}
        />
      </div>
      <div className="doctor-signup">
        <input
          type="text"
          className="input_elements"
          name="place_of_work"
          placeholder="Place Of Work"
          onChange={handleChange}
        />
      </div>
      <div className="doctor-signup">
        <input
          type="text"
          className="input_elements"
          name="proof"
          placeholder="Acting medical professional proof"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Doctor;
