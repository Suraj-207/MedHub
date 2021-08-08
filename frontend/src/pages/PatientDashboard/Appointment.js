import React,{useState, useContext, useEffect} from 'react'
import "./Appointment.css"
import LoadingSpinner from '../../shared/UIComponent/LoadingSpinner';
import { AuthContext } from '../../shared/context/AuthContext';

const Appointment = () => {
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
          //   setErr(true);
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
  }, [auth.token]);
    return (
        <React.Fragment>
            <div>{load && <LoadingSpinner asOverlay />} </div>
        <div>
            
        </div>
        </React.Fragment>
    )
}

export default Appointment