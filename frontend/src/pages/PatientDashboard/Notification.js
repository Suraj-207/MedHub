import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import "./Notification.css";

const Notification = () => {
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
          "http://localhosts:5000/api/notifications",
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
      <div className="notification">
        {details &&
          details.map((item, index) => {
            return (
              <div className="notification_details" key={index}>
                <p>{item.message}</p>
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
};

export default Notification;
