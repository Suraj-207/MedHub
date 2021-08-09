import React from "react";
import Modal from "./Modal";
import Button from "../FormElements/Button";

const ConfirmModal = (props) => {
  return (
    <Modal
      header="Confirm Cancellation"
      show={!!props.text}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <button onCancel={props.onCancel}>Cancel</button>
      <p>{props.text}</p>
    </Modal>
  );
};

export default ConfirmModal;
