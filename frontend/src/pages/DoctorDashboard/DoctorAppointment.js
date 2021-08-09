import React, { useContext, useEffect, useState } from "react";
import "./DoctorAppointment.css";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";
import Modal from "react-modal";
import Input from "../../shared/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/FormElements/Button";

const DoctorAppointment = () => {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [itemIndex, setIndex] = useState("");
  const [details, setDetails] = useState();
  const [formState, inputHandler] = useForm();
  const [modalIsOpen, setIsOpen] = useState(false);
  let subtitle;
  const tdate = new Date();
  tdate.toLocaleDateString();
  const month = parseInt(tdate.toLocaleDateString().split("/")[0]);
  const date = parseInt(tdate.toLocaleDateString().split("/")[1]);
  const year = parseInt(tdate.toLocaleDateString().split("/")[2]);
  const newDate = `${year}-${month < 10 ? 0 : ""}${month}-${
    date < 10 ? 0 : ""
  }${date}`;
  console.log(newDate);

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

  const handleClick = (index) => {
    setIndex(index);
    openModal();
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

  const confirmHandler = () => {
    let fetchData;
    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          token: auth.token,
          diagnosis: formState.inputs.diagnosis.value,
          prescription: formState.inputs.prescription.value,
          date: details[itemIndex].start,
        };
        console.log(data);
        const response = await fetch(
          "http://localhost:5000/api/doctor-complete",
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
          "http://localhost:5000/api/doctor-fetch-upcoming",
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
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
          Confirm appointment completion?
        </h2>
        <button onClick={closeModal}>close</button>
        <button onClick={confirmHandler}>Confirm</button>
      </Modal>
      <div>{load && <LoadingSpinner asOverlay />} </div>
      <div className="appointment_details">
        {details && (
          <table className="dstable dstable-striped dstable-light">
            <tbody>
              <tr>
                <th>Patient Firstname</th>
                <th>Patient Lastname</th>
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
                      <td>{item.fname}</td>
                      <td>{item.lname}</td>
                      <td>{item.issue}</td>
                      <td>{item.session}</td>
                      <td>{item.start.split("T")[0]}</td>
                      <td>{item.start.split("T")[1].slice(0, 5)}</td>
                      <td>
                        {
                          <Input
                            id="diagnosis"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter diagnosis"
                            onInput={inputHandler}
                          />
                        }
                      </td>
                      <td>
                        {
                          <Input
                            id="prescription"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter prescription"
                            onInput={inputHandler}
                          />
                        }
                      </td>
                      <td>{item.status}</td>
                      <td>
                        <Button
                          className="action_button"
                          onClick={() => handleClick(index)}
                          disabled={item.start.split("T")[0] !== newDate}
                        >
                          Mark as Done
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

export default DoctorAppointment;
