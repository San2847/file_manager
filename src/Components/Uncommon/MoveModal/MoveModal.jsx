import React, { useEffect, useState } from "react";
import styles from "./moveModal.module.css";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDateString, getFiles } from "../../../Services/commonFunctions";
import { FaFolder } from "react-icons/fa";
import { clearFileCheckbox, setModalState } from "../../../Redux/slices/filemanagerSlice";
import { getReq, postReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getUserId } from "../../../Services/authService";
import { useParams } from "react-router-dom";

const MoveModal = () => {
  const dispatch = useDispatch();
  const { moveModal, fileFolderArr, fileCheckBoxArr } = useSelector((state) => state.filemanager);
  const [onlyFolders, setOnlyFolders] = useState([]);

  const { id } = useParams();
  console.log({ fileCheckBoxArr })
  const [selectedFolder, setSelectedFolder] = useState({});

  const moveFilesTo = async () => {
    let type = 0;
    let filtArr = fileCheckBoxArr.filter((curElem) => {
      return curElem.container._id !== selectedFolder._id;
    });
    let outFilesOnly = filtArr.every((curElem) => {
      return !curElem.container.folderName;
    });
    let inFilesOnly = filtArr.every((curElem) => {
      return curElem.container.folderName;
    });
    if (outFilesOnly) {
      type = 1;
    } else if (selectedFolder === "home") {
      type = 3;
    } else if (inFilesOnly) {
      type = 2;
    }

    let x = JSON.parse(JSON.stringify(fileCheckBoxArr));
    x.forEach((curElem) => {
      delete curElem.fileOrFold._id;
      curElem.fileOrFold["id"] = curElem.container._id;
    });
    let y = x.map((curElem) => {
      return curElem.fileOrFold;
    });

    let sendObj = { userId: getUserId() };

    if (type === 1 || type === 2) {
      sendObj["folderId"] = selectedFolder._id;
    }
    sendObj["fileDetails"] = [...y];
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/move-files?type=${type}`, sendObj);
    if (res && !res.error) {
      getFiles(1, id);
      setSelectedFolder({});
      dispatch(setModalState({ modal: "moveModal", state: false }));
      dispatch(clearFileCheckbox());
    } else {
      console.log(res.error);
    }
  };
  const getAllFolderData = async () => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-folders-by-projectId?${localStorage.getItem("userId")}`);
    if (res && !res.error) {
      console.log(res)
      // setProfileData({ ...res.data.data });
      // setAclData(res?.data?.data);
      // console.log(res.data)
    }
  }
  useEffect(() => {
    if (fileFolderArr && fileFolderArr.length > 0) {
      let x = fileFolderArr.filter((curElem) => {
        return curElem.folderName;
      });
      setOnlyFolders([...x]);
    }
  }, [fileFolderArr]);
  useEffect(() => {
    getAllFolderData()
  }, [])

  return (
    <Modal show={moveModal} centered size="md">
      <Modal.Header className={styles.heading}>Move files to</Modal.Header>
      <Modal.Body>
        <div className={styles.filesContainer}>
          <div className={styles.headerContainer}>
            <div style={{ width: "40%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Name</div>
            <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Date Added</div>
            <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Last Modified</div>
          </div>
          <div className={styles.contentContainer}>
            <div className={`${styles.eachCard} ${selectedFolder === "home" && styles.activeCard}`} onClick={(event) => setSelectedFolder("home")}>
              <div style={{ width: "40%", fontSize: "12px", display: "flex", alignItems: "center", paddingLeft: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <div className="d-flex align-items-center" title="Home">
                  <FaFolder color="#F2B007" style={{ marginRight: "0.5rem" }} />
                  Home
                </div>
              </div>
              <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>-</div>
              <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>-</div>
            </div>
            {onlyFolders &&
              onlyFolders.map((curElem) => {
                return (
                  <>
                    <div className={`${styles.eachCard} ${selectedFolder._id === curElem._id && styles.activeCard}`} onClick={(event) => setSelectedFolder(curElem)}>
                      <div style={{ width: "40%", fontSize: "12px", display: "flex", alignItems: "center", paddingLeft: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <div className="d-flex align-items-center" title={curElem.folderName ? curElem.folderName : "Untitled"}>
                          <FaFolder color="#F2B007" style={{ marginRight: "0.5rem" }} />
                          {curElem.folderName ? curElem.folderName : "Untitled"}
                        </div>
                      </div>
                      <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>
                        {curElem.createdAt ? createDateString(curElem.createdAt) : "-"}
                      </div>
                      <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>
                        {curElem.updatedAt ? createDateString(curElem.updatedAt) : "-"}
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className={styles.noButton} onClick={() => dispatch(setModalState({ modal: "moveModal", state: false }))}>
          Cancel
        </button>
        <button className={styles.yesButton} onClick={moveFilesTo}>
          Move to
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MoveModal;
