import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import Input from "../../shared/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/FormElements/Button";
import "./PatientProfile.css";

const PatientProfile = () => {
  const [details, setDetails] = useState({});
  const [load, setLoad] = useState(true);
  const [image,setImage] = useState();
  const [formState, inputHandler] = useForm();
  const [value, setValue] = useState({title: "", content: "", image: null});
  const auth = useContext(AuthContext);
  let data, fetchData;

  const handleChange= (e) => {
    setValue({
      ...value,
      [e.target.id]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    setValue({
      ...value,
      image: e.target.files[0]
    })

    console.log(e.target.files[0])
  }

  const handleImageSubmit = (e) => {
    e.preventDefault();
    try {
      setLoad(true)
      fetchData = async () => {
        let data = new FormData();
        data.append('image', value.image)
        const response = await fetch(
          "https://localhost:5000/api/fetch-image",
          {
            method: "POST",
            body: data,
          }
        );
        const result = await response;
        console.log(result);
        setImage(result.body);
        if (response.ok) {
          console.log("done");
          setLoad(false)
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();
  

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetchData = async () => {
        setLoad(true);
        const data = {
          token: auth.token,
          changes: {
            phone: formState.inputs.phone.value,
            state: formState.inputs.state.value,
            city: formState.inputs.city.value,
            pin: formState.inputs.pin.value,
          },
        };
        console.log(data);
        const response = await fetch(
          "https://localhost:5000/api/change-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        console.log(result);
        
        if (response.ok) {
          setLoad(false);
          console.log("done");
          window.location.reload();
        }
      };
    } catch (err) {
      console.log(err);
    }
    fetchData();

    console.log(data);
  };

  const setDetailsHandler = (result) => {
    setDetails(result);
    setLoad(false);
  };

  useEffect(() => {
    let fetchData;
    try {
      fetchData = async () => {
        const data = { token: auth.token };
        const response = await fetch(
          "https://localhost:5000/api/fetch-profile",
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
          console.log("unidentified token");
        } else {
          setDetailsHandler(result);
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
      <div className="heading">
        <h1>doctor_profile</h1>
      </div>
      {/* <div className="App">
        <form onSubmit={handleImageSubmit}>
          <p>
            <input
              type="text"
              placeholder="Title"
              id="title"
              value="title"
              onChange={handleChange}
              required
            />
          </p>
          <p>
            <input
              type="text"
              placeholder="Content"
              id="content"
              value="content"
              onChange={handleChange}
              required
            />
          </p>
          <p>
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              required
            />
          </p>
          <input type="submit" />
        </form>
      </div> */}
      <div>{load && <LoadingSpinner asOverlay />} </div>
      {/* {load &&<img src={`data:image/png;base64,${image}`} />} */}
      {!load && details && (
        <div className="patient_form">
          <div className="patient_form-left">
            <div className="patient_profile">
              <h4>Firstname:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.fname : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Lastname:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.lname : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Email:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.email : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Gender:</h4>
              <label>
                {Object.keys(details).length > 0 ? details.gender : ""}
              </label>
            </div>
            <div className="patient_profile">
              <h4>Phone:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="phone"
                  validators={[
                    VALIDATOR_MAXLENGTH(10),
                    VALIDATOR_MINLENGTH(10),
                  ]}
                  errorText="Please enter correct phone no"
                  onInput={inputHandler}
                  initialValue={details.phone}
                  initialValid={true}
                />
              </div>
            </div>
            <div className="patient_profile">
              <h4>City:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="city"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your city"
                  name="city"
                  initialValue={details.city}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
            <div className="patient_profile">
              <h4>State:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  id="state"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your state"
                  onInput={inputHandler}
                  initialValue={details.state}
                  initialValid={true}
                />
              </div>
            </div>
            <div className="patient_profile">
              <h4>Pin:</h4>
              <div>
                <Input
                  element="input"
                  type="text"
                  className="input_elements"
                  name="pin"
                  id="pin"
                  validators={[VALIDATOR_MAXLENGTH(6), VALIDATOR_MINLENGTH(6)]}
                  errorText="Please enter correct pin"
                  initialValue={details.pin}
                  initialValid={true}
                  onInput={inputHandler}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="patient_profile_button">
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={!formState.isValid}
        >
          {"Confirm changes"}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default PatientProfile;
