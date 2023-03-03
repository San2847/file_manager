import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsCheck } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import styles from "./uploadFileModal.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdImage } from "react-icons/io";
import { clearArrayForApproval, saveArrayForApproval, setFilesGoingFor, setModalState } from "../../../Redux/slices/filemanagerSlice";
import { getFiles } from "../../../Services/commonFunctions";

const UploadFileModal = () => {
  const dispatch = useDispatch();
  const { uploadFileModal, arrayForApproval, fileFolderArr } = useSelector((state) => state.filemanager);
  const [tabState, setTabState] = useState("drive");

  const createDateString = (dateItem) => {
    const arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = new Date(dateItem).getDate();
    const month = new Date(dateItem).getMonth();
    const year = new Date(dateItem).getFullYear();
    return `${day}-${arr[month]}-${year}`;
  };

  const [openedFolder, setOpenedFolder] = useState([]);
  const openFolderOrSelectFiles = (outElem, event, inElem) => {
    event.stopPropagation();
    if (outElem.fileDetails.length > 1) {
      if (!inElem) {
        if (!openedFolder.includes(outElem._id)) {
          setOpenedFolder((prev) => {
            return [...prev, outElem._id];
          });
        } else {
          let x = openedFolder.filter((curElem) => {
            return curElem !== outElem._id;
          });
          setOpenedFolder([...x]);
        }
      }
      if (inElem) {
        let obj = {};
        obj["file"] = inElem;
        obj["container"] = outElem;
        dispatch(saveArrayForApproval(obj));
      }
    } else {
      let obj = {};
      obj["file"] = outElem.fileDetails[0];
      obj["container"] = outElem;
      dispatch(saveArrayForApproval(obj));
    }
  };

  const [selectionArr, setSelectionArr] = useState([]);
  useEffect(() => {
    let x = arrayForApproval.map((curElem) => {
      return curElem.file._id;
    });
    setSelectionArr([...x]);
  }, [arrayForApproval]);
  useEffect(() => {
    if (uploadFileModal) {
      getFiles(1);
    }
  }, [uploadFileModal]);
  return (
    <Modal centered size="lg" show={uploadFileModal}>
      <Modal.Body className="d-flex align-items-center flex-column">
        <div className={styles.tabContainer}>
          <div className="d-flex justify-content-center" style={{ width: "50%" }}>
            <div className={`${styles.eachTab} ${tabState === "drive" && styles.activeTab}`} onClick={() => setTabState("drive")}>
              Select from Drive
            </div>
          </div>
          <div className="d-flex justify-content-center" style={{ width: "50%" }}>
            <div className={`${styles.eachTab} ${tabState === "upload" && styles.activeTab}`} onClick={() => setTabState("upload")}>
              Upload from Computer
            </div>
          </div>
        </div>
        <div className={styles.filesContainer}>
          <div className={styles.headerContainer}>
            <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Name</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Space Name</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Drawing Type</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Date Added</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", fontWeight: "500" }}>Last Modified</div>
          </div>
          <div className={styles.contentContainer}>
            {fileFolderArr &&
              fileFolderArr.map((curElem) => {
                return (
                  <>
                    <div className={styles.eachCard} onClick={(event) => openFolderOrSelectFiles(curElem, event, undefined)}>
                      <div style={{ width: "30%", fontSize: "12px", display: "flex", alignItems: "center", paddingLeft: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {curElem.fileDetails.length > 1 ? (
                          <div className={styles.noBox}></div>
                        ) : (
                          <div
                            className={`${styles.checkBox} ${selectionArr.includes(curElem.fileDetails[0]._id) && styles.activeBox}`}
                            onClick={(event) => openFolderOrSelectFiles(curElem, event, undefined)}
                          >
                            <BsCheck />
                          </div>
                        )}
                        <div className="d-flex align-items-center" title={curElem.fileDetails.length > 1 ? (curElem.folderName ? curElem.folderName : "Untitled") : curElem.fileDetails[0].fileName}>
                          {curElem.fileDetails.length > 1 ? (
                            <FaFolder color="#F2B007" style={{ marginRight: "0.5rem" }} />
                          ) : curElem.fileDetails[0].fileType.split("/")[0] === "image" ? (
                            <IoMdImage fontSize={15} color="#26AD74" style={{ marginRight: "0.5rem" }} />
                          ) : (
                            <img src={pdfIcon} alt="" style={{ height: "14px", marginRight: "0.5rem" }} />
                          )}
                          {curElem.fileDetails.length > 1 ? (curElem.folderName ? curElem.folderName : "Untitled") : curElem.fileDetails[0].fileName}
                        </div>
                      </div>
                      <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>
                        {curElem.fileDetails.length > 1 ? "" : curElem.spaceName ? curElem.spaceName : "-"}
                      </div>
                      <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>
                        {curElem.fileDetails.length > 1 ? "" : curElem.drawingType ? curElem.drawingType : "-"}
                      </div>
                      <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Date Added</div>
                      <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>
                        {curElem.updateTime ? createDateString(curElem.updateTime) : "-"}
                      </div>
                    </div>
                    <div className={styles.insideFileContainer} style={{ height: openedFolder.includes(curElem._id) ? "8rem" : "0" }}>
                      {curElem.fileDetails.length > 1 &&
                        curElem.fileDetails.map((cur) => {
                          return (
                            <div className={styles.eachCardInside}>
                              <div
                                style={{
                                  width: "30%",
                                  fontSize: "12px",
                                  display: "flex",
                                  alignItems: "center",
                                  paddingLeft: "0.5rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <div className={`${styles.checkBox} ${selectionArr.includes(cur._id) && styles.activeBox}`} onClick={(event) => openFolderOrSelectFiles(curElem, event, cur)}>
                                  <BsCheck />
                                </div>
                                <div className="d-flex align-items-center" title={cur.fileName}>
                                  {cur.fileType.split("/")[0] === "image" ? (
                                    <IoMdImage fontSize={15} color="#26AD74" style={{ marginRight: "0.5rem" }} />
                                  ) : (
                                    <img src={pdfIcon} alt="" style={{ height: "14px", marginRight: "0.5rem" }} />
                                  )}
                                  {cur.fileName}
                                </div>
                              </div>
                              <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>{cur.spaceName ? cur.spaceName : "-"}</div>
                              <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>{cur.drawingType ? cur.drawingType : "-"}</div>
                              <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Date Added</div>
                              <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center", color: "#333333CC" }}>
                                {cur.updateTime ? createDateString(cur.updateTime) : "-"}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </>
                );
              })}
          </div>
        </div>
        <div className="py-2 w-100 d-flex justify-content-end">
          <button
            className={styles.cancelButton}
            onClick={() => {
              dispatch(setFilesGoingFor(""));
              dispatch(clearArrayForApproval());
              dispatch(setModalState({ modal: "uploadFileModal", state: false }));
            }}
          >
            Cancel
          </button>
          <button
            className={styles.selectButton}
            onClick={() => {
              dispatch(setModalState({ modal: "uploadFileModal", state: false }));
              dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
            }}
          >
            {arrayForApproval.length > 0 ? `${arrayForApproval.length} items selected` : "Select an Item"}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UploadFileModal;
