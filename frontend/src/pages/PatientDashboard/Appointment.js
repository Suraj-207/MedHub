import React, { useState, useContext, useEffect } from "react";
import "./Appointment.css";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";

const Appointment = () => {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState();
  const [itemIndex, setIndex] = useState();
  const [confirmstatus, setConfirmStatus] = useState(false);

  const handleClick = (index) => {
    setIndex(index);
    setConfirmStatus(true);
  };
  const confirmHandler = () => {
    let fetchData
    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          token: auth.token,
          doctor_email: details[itemIndex].doctor_email,
          date: details[itemIndex].start,
        };
        console.log(data);
        const response = await fetch(
          "http://localhost:5000/api/cancel-slot",
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
        {details && (
          <table>
            <tbody>
              <tr>
                <th>S.No</th>
                <th>Doctor Firstname</th>
                <th>Doctor Lastname</th>
                <th>Doctor email</th>
                <th>Issue</th>
                <th>Session length</th>
                <th>Date</th>
                <th>Time</th>
                <th>Diagnosis</th>
                <th>Prescription</th>
                <th>Status</th>
                {confirmstatus && <th>Confirm status</th>}
              </tr>

              {details &&
                details.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.fname}</td>
                      <td>{item.lname}</td>
                      <td>{item.doctor_email}</td>
                      <td>{item.issue}</td>
                      <td>{item.session}</td>
                      <td>{item.start.split("T")[0]}</td>
                      <td>{item.start.split("T")[1].slice(0, 5)}</td>
                      <td>{item.diagnosis}</td>
                      <td>{item.prescription}</td>
                      <td>
                        <button onClick={() => handleClick(index)}>
                          Click to Cancel
                        </button>
                      </td>
                      {confirmstatus && (
                        <td>
                          <button onClick={confirmHandler}>
                            Confirm cancellation
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </React.Fragment>
  );
};

export default Appointment;
