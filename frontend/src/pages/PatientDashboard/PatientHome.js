import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../shared/context/AuthContext";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import Item from "../../components/Item";
import "./PatientHome.css";
import { useForm } from "../../shared/hooks/form-hook";
import { CountryDropdown } from "react-indian-state-region-selector";
import Modal from "react-modal";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import useGeolocation from "react-hook-geolocation";

const PatientHome = () => {
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);
  const auth = useContext(AuthContext);
  const [country, setCountry] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [formState, inputHandler] = useForm();
  const geolocation = useGeolocation();
  let subtitle;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const getGeolocation = () => {
    const latitude = geolocation.latitude;
    const longitude = geolocation.longitude;

    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = {
          token: auth.token,
          longitude: longitude,
          latitude: latitude,
        };
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
  const filterHandler = () => {
    openModal();
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const fetchfilter = () => {
    console.log(country);
    console.log(formState.inputs.city);
    console.log(formState.inputs.speciality);

    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = {
          token: auth.token,
          city: formState.inputs.city.isValid ? formState.inputs.city.value : "",
          speciality: formState.inputs.speciality.isValid
            ? formState.inputs.speciality.value
            : "",
          state: country,
        };
        const response = await fetch(
          "https://localhost:5000/api/filter-doctors",
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
          console.log(result);
          setDetails(result.doctors);
          console.log("done");
          setLoad(false);
        }
        if (response.ok) {
          console.log("done");
          closeModal();
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
          longitude: "",
          latitude: "",
        };
        const response = await fetch(
          "https://localhost:5000/api/fetch-doctors",
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
  }, [auth.token]);
  return (
    <React.Fragment>
      <div className="row">
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Filter doctor by:</h2>
          <Input
            placeholder="city"
            onInput={inputHandler}
            element="input"
            id="city"
            validators={[VALIDATOR_REQUIRE]}
          />
          <CountryDropdown
            className="state"
            value={country}
            onChange={setCountry}
          />
          <Input
            placeholder="speciality"
            element="input"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE]}
            id="speciality"
          />
          <Button onClick={closeModal}>Close</Button>
          <Button onClick={fetchfilter}>Done</Button>
        </Modal>
        <div>{load && <LoadingSpinner asOverlay />} </div>
        <div>{err && <div>No doctor found</div>} </div>

        <div className="filter_geolocation">
          <div className="type">
            <p>Filter by</p>
          </div>
          <div className="type">
            <Button onClick={filterHandler}>Criteria </Button>
          </div>
          <div className="type">
            <Button onClick={getGeolocation}>Geolocation</Button>
          </div>
        </div>
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
