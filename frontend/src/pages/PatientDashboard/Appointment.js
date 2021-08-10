import React, { useState, useContext, useEffect } from "react";
import "./Appointment.css";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";
import Modal from "react-modal";
import Button from "../../shared/FormElements/Button";

const Appointment = () => {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState();
  const [itemIndex, setIndex] = useState("");
  const [status, setcancelStatus] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  let subtitle;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const cancelStatus = (index) => {
    setIndex(index);
    openModal();
    setcancelStatus((prev) => !prev);
  };

  const confirmHandler = () => {
    let fetchData;
    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          token: auth.token,
          doctor_email: details[itemIndex].doctor_email,
          date: details[itemIndex].start,
        };
        console.log(data);
        const response = await fetch("http://localhost:5000/api/cancel-slot", {
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
          setLoad(false);
          console.log("unidentified token");
        } else {
          console.log(result);
          setDetails(result);
          console.log("done");
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
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <div>Confirm cancellation?</div>
        <button onClick={closeModal}>close</button>
        <button onClick={confirmHandler}>Confirm</button>
      </Modal>
      <div className="appointment_details">
        {details && (
          <table className="dstable dstable-striped dstable-light">
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
                <th>Action</th>
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
                        {item.status}
                      </td>
                      <td>
                        <Button
                          onClick={() => {
                            cancelStatus(index);
                          }}
                          
                          disabled={item.status!=="pending"}
                        >
                          Click to Cancel
                        </Button>
                      </td>
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
