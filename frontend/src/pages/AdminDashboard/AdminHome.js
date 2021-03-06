import React, { useEffect, useContext, useState } from "react";
import LoadingSpinner from "../../shared/UIComponent/LoadingSpinner";
import Modal from "react-modal";
import { AuthContext } from "../../shared/context/AuthContext";
import Button from "../../shared/FormElements/Button";

const AdminHome = () => {
  const [load, setLoad] = useState(false);
  const [details, setDetails] = useState([]);
  const auth = useContext(AuthContext);
  const [index, setIndex] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  let subtitle;
  const cancelStatus = (index) => {
    setIndex(index);
    openModal();
  };

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

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#04032b";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleSubmit = () => {
    closeModal();
    setLoad(true);
    let fetchData;
    try {
      fetchData = async () => {
        const data = {
          token: auth.token,
          email: details[index].email
        };
        const response = await fetch(
          "/api/admin-change-active",
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
          window.location.reload();
        } else {
          window.location.reload();
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
          "/api/admin-fetch-active",
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
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Deactivate?</h2>
        <Button onClick={closeModal}>close</Button>
        <Button onClick={handleSubmit}>Confirm</Button>
      </Modal>
      <div className="appointment_details">
        {details && details.length > 0 && (
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
                      <td>{item.active ? "True" : "False"}</td>
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

export default AdminHome;
