import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiLinks } from "../../../constants/constants";
import { clearFileCheckbox, savePrepareDeleteArr, setModalState } from "../../../Redux/slices/filemanagerSlice";
import { postReq } from "../../../Services/api";
import { getFiles } from "../../../Services/commonFunctions";
import styles from "./deleteFilesModal.module.css";
import { useParams } from "react-router-dom";

const DeleteFilesModal = () => {
  const dispatch = useDispatch();
  const { deleteModal, reduxPrepareDeleteArr } = useSelector((state) => state.filemanager);

  const { id } = useParams();

  const deleteMultipleFiles = async () => {
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/delete-files`, reduxPrepareDeleteArr);
    if (res && !res.error) {
      dispatch(savePrepareDeleteArr([]));
      dispatch(clearFileCheckbox());
      getFiles(1, id);
    } else {
      console.log(res.error);
    }
  };
  return (
    <Modal show={deleteModal} centered>
      <Modal.Body>Are you sure you want to delete these files?</Modal.Body>
      <Modal.Footer>
        <button
          className={styles.yesButton}
          onClick={() => {
            deleteMultipleFiles();
            dispatch(setModalState({ modal: "deleteModal", state: false }));
          }}
        >
          Yes
        </button>
        <button className={styles.noButton} onClick={() => dispatch(setModalState({ modal: "deleteModal", state: false }))}>
          No
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteFilesModal;
