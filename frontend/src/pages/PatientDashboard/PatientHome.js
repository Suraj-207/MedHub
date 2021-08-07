import React,{useState, useEffect, useContext} from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";

const PatientHome = () => {
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);
  const auth = useContext(AuthContext)

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
          {/* {product &&
                product.map((item, index) => {
                  return (
                    <Item
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      src={item.img_link}
                      price={item.price}
                      href={item.href}
                    />
                  );
                })} */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PatientHome;
