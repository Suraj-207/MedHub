import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
  const handleClick = () => {
    console.log(props.email);
  };

  return (
    <div>
      <div className="row_data_item" key={props.email}>
        <div className="row_data_single">
          <div>
            <img
              src={`data:image/png;base64,${props.image}`}
              alt={props.fname}
            />
          </div>
          <div
            className="row_data_single_desc"
            name="href"
            onClick={handleClick}
          >
            <p>
              {`Name: Dr.${props.fname} `} {` | City: ${props.city}`}
            </p>
            <p>Speciality: {props.speciality}</p>
            <Link
              to={{
                pathname: "/confirm",
                props: {
                  email: `${props.email}`,
                  fname: `${props.fname}`,
                  lname: `${props.lname}`,
                },
              }}
            >
              <h5>Click here to book an appointment</h5>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
