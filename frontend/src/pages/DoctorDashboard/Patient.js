import React,{useState, useEffect, useContext} from 'react'
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";
import Button from '../../shared/FormElements/Button';

const Patient = () => {
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
            "https://localhost:5000/api/doctor-fetch-past",
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
          } else {
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
        <div className="appointment_details">
            {details &&
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
                      <td>{item.start.split("T")[1].slice(0,5)}</td>
                      <td><textarea defaultValue={`${item.diagnosis}`} /></td>
                      <td><textarea defaultValue={`${item.prescription}`} /></td>
                      <td><Button>{item.status} </Button></td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
      }
        </div>
      </React.Fragment>
    );
}

export default Patient
