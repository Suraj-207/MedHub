import React, { useState, useContext } from "react";
import DateTimePicker from "react-datetime-picker";
import "./TakeLeave.css";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import Button from "../../shared/FormElements/Button";
import Modal from "react-modal";

const TakeLeave = () => {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [cancelstatus, setcancelStatus] = useState(false);
  const [reschedulestatus, setrescheduleStatus] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [leavestart, setLeaveStart] = useState(new Date());
  const [leaveend, setLeaveEnd] = useState(new Date());
  let subtitle;
  const theDate = new Date();
  const myNewDate = new Date(theDate);
  myNewDate.setDate(myNewDate.getDate() + 15);

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

  const cancelHandler = () => {
    console.log(myNewDate);
    setcancelStatus(true);
    setrescheduleStatus(false);
  };

  const rescheduleHandler = () => {
    setcancelStatus(false);
    setrescheduleStatus(true);
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

  const handleClick = () => {
    let fetchData;
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const start = new Date(leavestart - tzoffset).toISOString().slice(0, -5);
    const end = new Date(leaveend - tzoffset).toISOString().slice(0, -5);

    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          token: auth.token,
          status: cancelstatus ? cancelstatus : reschedulestatus,
          start: start,
          end: end,
        };
        console.log(data);
        const response = await fetch("http://localhost:5000/api/take-a-leave", {
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
          openModal();
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  };

  return (
    <div className="container">
      <div className="leave_application">
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
            Your leave has been recorded.
          </h2>
          <button onClick={closeModal}>Ok</button>
        </Modal>
        <div>{load && <LoadingSpinner asOverlay />} </div>
        <div className="take-leave">
          <div className="take_leave_params">
            <DateTimePicker
              onChange={setLeaveStart}
              value={leavestart}
              minDate={new Date()}
              maxDate={myNewDate}
            ></DateTimePicker>
          </div>
          <div className="take_leave_params">
            <DateTimePicker
              onChange={setLeaveEnd}
              value={leaveend}
              minDate={new Date()}
              maxDate={myNewDate}
            ></DateTimePicker>
          </div>
          <div className="select">
            <div className="take_leave_params">
              <button
                className={cancelstatus ? "action_button" : "inactive_button"}
                onClick={cancelHandler}
              >
                Cancel all Appointmnents
              </button>
            </div>
            <div className="take_leave_params">
              <button
                className={
                  reschedulestatus ? "action_button" : "inactive_button"
                }
                onClick={rescheduleHandler}
              >
                Reschedule Appointmnents
              </button>
            </div>
          </div>
          <div className="take_leave_params">
            <Button
              onClick={handleClick}
              disabled={cancelstatus || reschedulestatus ? false : true}
            >
              Submit Leave
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeLeave;
