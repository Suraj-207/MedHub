import React, { useEffect, useContext, useState } from "react";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/AuthContext";

const AdminHome = () => {
  const [load, setLoad] = useState(false);
  const auth = useContext(AuthContext);

  //   const handleSubmit = () => {
  //     setLoad(true);
  //     let fetchData;
  //     try {
  //       fetchData = async () => {
  //         const data = {
  //           token: auth.token,
  //           longitude: longitude,
  //           latitude: latitude,
  //         };
  //         const response = await fetch(
  //           "http://localhost:5000/api/fetch-doctors",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(data),
  //           }
  //         );
  //         const result = await response.json();
  //         if (result === null) {
  //         //   setErr(true);
  //           setLoad(false);
  //           console.log("unidentified token");
  //         } else {
  //           console.log(result);
  //           setDetails(result.doctors);
  //           console.log("done");
  //           setLoad(false);
  //         }
  //         if (response.ok) {
  //           console.log("done");
  //         }
  //       };
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     fetchData();
  //   };

  useEffect(() => {
    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = {
          token: auth.token,
        };
        const response = await fetch("https://localhost:5000/api/admin-fetch-active", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result === null) {
          setLoad(false);
          console.log("unidentified token");
        } else {
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
      {/* <div className="appointment_details">
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
      </div> */}
    </React.Fragment>
  );
};

export default AdminHome;
