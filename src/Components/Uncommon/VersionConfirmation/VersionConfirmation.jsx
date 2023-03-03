import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setModalState } from "../../../Redux/slices/filemanagerSlice";
import styles from "./versionConfirmation.module.css";

const VersionConfirmation = () => {
  const dispatch = useDispatch();
  const { versionConfirmation } = useSelector((state) => state.filemanager);
  return (
    <Modal show={versionConfirmation} centered>
      <Modal.Body>This File is already in execution Do you still want to update this file to a new version?</Modal.Body>
      <Modal.Footer>
        <button className={styles.noButton} onClick={() => dispatch(setModalState({ modal: "versionConfirmation", state: false }))}>
          Cancel
        </button>
        <button className={styles.yesButton}>Yes, Confirm</button>
      </Modal.Footer>
    </Modal>
  );
};

export default VersionConfirmation;
