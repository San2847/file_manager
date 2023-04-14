import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { apiLinks } from "../../../constants/constants";
import { selectFileFolderToBeRenamed, setModalState } from "../../../Redux/slices/filemanagerSlice";
import { postReq } from "../../../Services/api";
import { getFiles, saveFileChangesAsVersion } from "../../../Services/commonFunctions";
import styles from "./renameModal.module.css";
import { getUserId } from "../../../Services/authService";
import { useParams } from "react-router-dom";

const RenameModal = () => {
  const dispatch = useDispatch();
  const { renameModal, fileFolderToBeRenamed, fileFolderArr } = useSelector((state) => state.filemanager);
  const [itemName, setItemName] = useState("");
  const [allFileNameArr, setAllFileNameArr] = useState([]);

  const { id } = useParams();

  const submitRename = async () => {
    if (fileFolderToBeRenamed.tab === "onlyFiles") {
      const res = await postReq(
        `${apiLinks.pmt}/api/file-manager/edit-file?id=${fileFolderToBeRenamed.fileOrFold.folderId}&fileId=${fileFolderToBeRenamed.fileOrFold._id}&userId=${getUserId()}&projectId=${
          fileFolderToBeRenamed.container.projectId ? fileFolderToBeRenamed.container.projectId : ""
        }`,
        {
          fileName: allFileNameArr.includes(itemName) ? `${itemName}-copy` : itemName,
        }
      );
      if (res && !res.error) {
        dispatch(setModalState({ modal: "renameModal", state: false }));
        saveFileChangesAsVersion({ container: fileFolderToBeRenamed.container, file: fileFolderToBeRenamed.fileOrFold, text: "File name is changed" }, undefined, id);
        getFiles(2, id);
      } else {
        console.log(res.error);
      }
    } else {
      if (fileFolderToBeRenamed.type === "outside" || fileFolderToBeRenamed.type === "inside") {
        const res = await postReq(
          `${apiLinks.pmt}/api/file-manager/edit-file?id=${fileFolderToBeRenamed.container._id}&fileId=${fileFolderToBeRenamed.fileOrFold._id}&userId=${getUserId()}&projectId=${
            fileFolderToBeRenamed.container.projectId ? fileFolderToBeRenamed.container.projectId : ""
          }`,
          {
            fileName: allFileNameArr.includes(itemName) ? `${itemName}-copy` : itemName,
          }
        );
        if (res && !res.error) {
          dispatch(setModalState({ modal: "renameModal", state: false }));
          saveFileChangesAsVersion({ container: fileFolderToBeRenamed.container, file: fileFolderToBeRenamed.fileOrFold, text: "File name is changed" }, undefined, id);
          getFiles(1, id);
        } else {
          console.log(res.error);
        }
      } else {
        const res = await postReq(`${apiLinks.pmt}/api/file-manager/rename-folder?id=${fileFolderToBeRenamed.fileOrFold._id}`, { folderName: itemName });
        if (res && !res.error) {
          dispatch(setModalState({ modal: "renameModal", state: false }));
          saveFileChangesAsVersion({ container: fileFolderToBeRenamed.container, file: fileFolderToBeRenamed.fileOrFold, text: "File name is changed" }, undefined, id);
          getFiles(1, id);
        } else {
          console.log(res.error);
        }
      }
    }
  };

  useEffect(() => {
    if (fileFolderArr) {
      let x = fileFolderArr.flatMap((curElem) => {
        return curElem.fileDetails;
      });
      let y = x.map((curElem) => {
        return curElem.fileName;
      });
      setAllFileNameArr([...y]);
    }
  }, [fileFolderArr]);

  useEffect(() => {
    if (Object.keys(fileFolderToBeRenamed).length > 0) {
      if (fileFolderToBeRenamed.type === "folder") {
        setItemName(fileFolderToBeRenamed.fileOrFold.folderName);
      } else if (fileFolderToBeRenamed.type === "outside") {
        setItemName(fileFolderToBeRenamed.fileOrFold.fileName ? fileFolderToBeRenamed.fileOrFold.fileName : "");
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
