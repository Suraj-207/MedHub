import React,{useState, useContext} from "react";
import "./Item.css";
import { AuthContext } from "../shared/context/AuthContext";
import LoadingSpinner from "../shared/UIComponent/LoadingSpinner";

const Item = (props) => {
  const auth = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);
  const [details, setDetails] = useState();
  const handleClick = () => {
    console.log(props.email);
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token };
        const response = await fetch(
          "http://localhost:5000/api/fetch-na-appointments",
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
          setErr(true);
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
  };
  return (
    <div>
      <div>{load && <LoadingSpinner asOverlay />} </div>
      <div className="row_data_item" key={props.email}>
        <div className="row_data_single">
          <img
            src="https://www.clipartmax.com/png/middle/171-1717870_stockvader-predicted-cron-for-may-user-profile-icon-png.png"
            alt={props.fname}
          />
          <div
            className="row_data_single_desc"
            name="href"
            onClick={handleClick}
          >
            <p>{`Name: Dr.${props.fname}`}</p>
            <p>City: {props.city}</p>
            <p>Speciality: {props.speciality}</p>
            <h5>Click here to book an appointment</h5>
          </div>
        </div>
        {/* {load && <LoadingSpinner asOverlay />} */}
      </div>
    </div>
  );
};

export default Item;
