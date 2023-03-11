import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { clearArrayForApproval, setModalState } from "../../../Redux/slices/filemanagerSlice";
import { approveFile } from "../../../Services/commonFunctions";
import styles from "./selfApprovalConfirmationModal.module.css";

const SelfApprovalConfirmationModal = () => {
  const dispatch = useDispatch();
  const { selfApprovalConfirmation, arrayForApproval } = useSelector((state) => state.filemanager);

  const approveSingleFile = (fileObj) => {
    approveFile(fileObj, "selfApprovalConfirmation");
  };
  const closeAndClean = () => {
    dispatch(clearArrayForApproval());
    dispatch(setModalState({ modal: "selfApprovalConfirmation", state: false }));
  };

  return (
    <Modal show={selfApprovalConfirmation} centered size="md" onHide={closeAndClean}>
      <Modal.Body>
        <div className={styles.modalContent}>This file does not have an approval do you want to self-approve the file?</div>
        <div className="d-flex justify-content-end">
          <button
            className="outlineButton"
            onClick={() => {
              dispatch(setModalState({ modal: "selfApprovalConfirmation", state: false }));
              dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
            }}
          >
            Send for Approval
          </button>
          <button className="yesButton" onClick={() => approveSingleFile(arrayForApproval[0])}>
            Yes, Approve
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SelfApprovalConfirmationModal;
