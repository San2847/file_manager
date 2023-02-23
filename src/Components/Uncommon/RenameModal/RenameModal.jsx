import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiLinks } from "../../../constants/constants";
import { selectFileFolderToBeRenamed, setModalState } from "../../../Redux/slices/filemanagerSlice";
import { postReq } from "../../../Services/api";
import { getFiles } from "../../../Services/commonFunctions";
import styles from "./renameModal.module.css";

const RenameModal = () => {
  const dispatch = useDispatch();
  const { renameModal, fileFolderToBeRenamed } = useSelector((state) => state.filemanager);
  const [itemName, setItemName] = useState("");

  const submitRename = async () => {
    if (fileFolderToBeRenamed.type === "outside" || fileFolderToBeRenamed.type === "inside") {
      const res = await postReq(`${apiLinks.pmt}/api/file-manager/edit-file?id=${fileFolderToBeRenamed.container._id}&fileId=${fileFolderToBeRenamed.fileOrFold._id}`, { fileName: itemName });
      if (res && !res.error) {
        getFiles();
        dispatch(setModalState({ modal: "renameModal", state: false }));
      } else {
        console.log(res.error);
      }
    } else {
      const res = await postReq(`${apiLinks.pmt}/api/file-manager/rename-folder?id=${fileFolderToBeRenamed.fileOrFold._id}`, { folderName: itemName });
      if (res && !res.error) {
        getFiles();
        dispatch(setModalState({ modal: "renameModal", state: false }));
      } else {
        console.log(res.error);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(fileFolderToBeRenamed).length > 0) {
      if (fileFolderToBeRenamed.type === "folder") {
        setItemName(fileFolderToBeRenamed.fileOrFold.folderName);
      } else if (fileFolderToBeRenamed.type === "outside") {
        setItemName(fileFolderToBeRenamed.fileOrFold.fileName);
      } else if (fileFolderToBeRenamed.type === "inside") {
        setItemName(fileFolderToBeRenamed.fileOrFold.fileName);
      } else {
        setItemName("");
      }
    }
  }, [fileFolderToBeRenamed]);
  
  return (
    <Modal centered show={renameModal} onHide={() => dispatch(setModalState({ modal: "renameModal", state: false }))}>
      <Modal.Body>
        <div className={styles.modalHeading}>Rename File/Folder</div>
        <div className={styles.renameInput}>
          <input type="text" value={itemName} onChange={(event) => setItemName(event.target.value)} />
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.cancelButton}
            onClick={() => {
              dispatch(setModalState({ modal: "renameModal", state: false }));
              dispatch(selectFileFolderToBeRenamed({}));
            }}
          >
            Cancel
          </button>
          <button className={styles.renameButton} onClick={submitRename}>
            Rename
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RenameModal;
