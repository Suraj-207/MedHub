import React, { useEffect, useContext, useState } from "react";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/AuthContext";
import Button from "../../shared/FormElements/Button";

const Inactive = () => {
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState([]);
  const auth = useContext(AuthContext);
  const [index, setIndex] = useState();

  const cancelStatus = (index) => {
    setIndex(index);
    handleSubmit();
  }

  const handleSubmit = () => {
    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = {
          token: auth.token,
          email: details[index].email,
          acc_id: details[index].acc_id
        };
        const response = await fetch(
          "http://localhost:5000/api/admin-change-inactive",
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
          console.log(result);
          setDetails(result.doctors);
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
  };

  useEffect(() => {
    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = {
          token: auth.token,
        };
        const response = await fetch(
          "https://localhost:5000/api/admin-fetch-inactive",
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
          setDetails(result);
          console.log(result);
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
      <div>{load && <LoadingSpinner asOverlay />}</div>
      <div className="appointment_details">
        {details && (
          <table className="dstable dstable-striped dstable-light">
            <tbody>
              <tr>
                <th>S.No</th>
                <th>Acc Id</th>
                <th>Doctor Firstname</th>
                <th>Doctor Lastname</th>
                <th>Doctor email</th>
                <th>Account</th>
                <th>ifsc</th>
                <th>Proof</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

              {details &&
                details.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.acc_id}</td>
                      <td>{item.fname}</td>
                      <td>{item.lname}</td>
                      <td>{item.email}</td>
                      <td>{item.account}</td>
                      <td>{item.ifsc}</td>
                      <td>{item.proof}</td>
                      <td>{item.active ? "true" : "false"}</td>
                      {/* <td>
                            {item.status}
                          </td> */}
                      <td>
                        <Button
                          onClick={() => {
                            cancelStatus(index);
                          }}
                        >
                          {item.active
                            ? "Click to deactivate"
                            : "Click to activate"}
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

export default Inactive;
