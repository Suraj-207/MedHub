import React, { useState, useContext } from "react";
import DateTimePicker from "react-datetime-picker";
import "./TakeLeave.css";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";

const TakeLeave = () => {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [status, setStatus] = useState("");
  const [leavestart, setLeaveStart] = useState(new Date());
  const [leaveend, setLeaveEnd] = useState(new Date());

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
          status: status,
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
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  };

  return (
    <div className="leave_application">
      <div>{load && <LoadingSpinner asOverlay />} </div>
      <DateTimePicker onChange={setLeaveStart} value={leavestart}></DateTimePicker>
      <DateTimePicker onChange={setLeaveEnd} value={leaveend}></DateTimePicker>
      <button onClick={() => setStatus("cancel")}>Cancel</button>
      <button
        onClick={() => {
          setStatus("reschedule");
        }}
      >
        Reschedule
      </button>
      <button onClick={handleClick}>Submit Leave</button>
    </div>
  );
};

export default TakeLeave;
