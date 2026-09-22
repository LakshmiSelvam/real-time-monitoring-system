import React from "react";
import "../Style/Model.css";
import ButtonField from "./ButtonField";
const Modal = ({ onCancel, onOk, show, content, disableCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{content}</p>
        <div className="button-container">
          <ButtonField
            onClick={onCancel}
            className={disableCancel ? "disable" : "cancel-btn"}
            label="Cancel"
          />
          <ButtonField onClick={onOk} className="ok-btn" label="OK" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
