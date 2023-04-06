import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiLinks } from "../../../constants/constants";
import { setModalState } from "../../../Redux/slices/filemanagerSlice";
import { postReq } from "../../../Services/api";
import { getUserId } from "../../../Services/authService";
import { getFiles } from "../../../Services/commonFunctions";
import styles from "./createFolderModal.module.css";
import { useParams } from "react-router-dom";

const CreateFolderModal = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { createFolderModal } = useSelector((state) => state.filemanager);
  const [folderNameText, setFolderNameText] = useState("");

  const createNewFolder = async () => {
    if (folderNameText) {
      let obj = {
        projectId: id,
        userId: getUserId(),
        folderName: folderNameText,
        fileDetails: [],
      };
      const res = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-details`, obj);
      if (res && !res.error) {
        getFiles(1);
        setFolderNameText("");
        dispatch(setModalState({ modal: "createFolderModal", state: false }));
      } else {
        console.log(res.error);
      }
    }
  };
  return (
    <Modal show={createFolderModal} centered>
      <Modal.Body>
        <div className={styles.heading}>New Folder</div>
        <div className={styles.inputContainer}>
          <input type="text" value={folderNameText} onChange={(event) => setFolderNameText(event.target.value)} />
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <button className={styles.noButton} onClick={() => dispatch(setModalState({ modal: "createFolderModal", state: false }))}>
            Cancel
          </button>
          <button className={styles.yesButton} onClick={createNewFolder}>
            Create
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateFolderModal;
