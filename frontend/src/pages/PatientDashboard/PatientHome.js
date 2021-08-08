import React,{useState, useEffect, useContext} from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import Item from "../../components/Item";
import "./PatientHome.css"

const PatientHome = () => {
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);
  const auth = useContext(AuthContext)
  const [details, setDetails] = useState([]);

  useEffect(() => {
    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token };
        const response = await fetch(
          "http://localhost:5000/api/fetch-doctors",
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
            setLoad(false)
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
      <div>{err && <div>No doctor found</div> } </div>
      <div className="row">
        <div className="row_data">
          {details &&
                details.map((item, index) => {
                  return (
                    <Item
                      key={item.email}
                      id={item.email}
                      email={item.email}
                      fname={item.fname}
                      lname={item.lname}
                      city={item.city}
                      speciality={item.speciality}
                    />
                  );
                })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PatientHome;
