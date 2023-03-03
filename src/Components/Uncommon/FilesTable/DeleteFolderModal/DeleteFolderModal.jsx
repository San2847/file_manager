import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiLinks } from "../../../../constants/constants";
import { setModalState } from "../../../../Redux/slices/filemanagerSlice";
import { postReq } from "../../../../Services/api";
import { getFiles } from "../../../../Services/commonFunctions";
import styles from "./deleteFolderModal.module.css";

const DeleteFolderModal = () => {
  const dispatch = useDispatch();
  const { deleteFolderModal, folderToBeDeleted } = useSelector((state) => state.filemanager);

  const deleteTheFolder = async () => {
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/delete-folder?id=${folderToBeDeleted}`);
    if (res && !res.error) {
      getFiles(1);
    } else {
      console.log(res.error);
    }
  };
  return (
    <Modal show={deleteFolderModal} centered>
      <Modal.Body>Are you sure you want to delete this folder and all of its contents?</Modal.Body>
      <Modal.Footer>
        <button
          className={styles.yesButton}
          onClick={() => {
            deleteTheFolder();
            dispatch(setModalState({ modal: "deleteFolderModal", state: false }));
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

export default DeleteFolderModal;
