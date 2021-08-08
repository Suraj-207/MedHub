import React, { useState, useContext, useEffect } from "react";
import "./Appointment.css";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";

const Appointment = () => {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState();

  useEffect(() => {
    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token };
        const response = await fetch(
          "http://localhost:5000/api/patient-fetch",
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
          //   setErr(true);
          setLoad(false);
          console.log("unidentified token");
        } else {
          //auth.login(result.user, result.token);
          console.log(result);
          setDetails(result);
          console.log("done");
          //   setDetailsHandler(result);
          setLoad(false);
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
  return (
    <React.Fragment>
      <div>{load && <LoadingSpinner asOverlay />} </div>
      <div className="appointment_details">
          {details &&
        <table>
          <tbody>
            <tr>
              <th>Doctor Firstname</th>
              <th>Doctor Lastname</th>
              <th>Issue</th>
              <th>Session length</th>
              <th>Date</th>
              <th>Time</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Status</th>
            </tr>
        
            {details &&
              details.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.fname}</td>
                    <td>{item.lname}</td>
                    <td>{item.issue}</td>
                    <td>{item.session}</td>
                    <td>{item.start.split("T")[0]}</td>
                    <td>{item.start.split("T")[1].slice(0,5)}</td>
                    <td>{item.diagnosis}</td>
                    <td>{item.prescription}</td>
                    <td><button>Click to Cancel</button></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
    }
      </div>
    </React.Fragment>
  );
};

export default Appointment;
