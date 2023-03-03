import React, { useState } from "react";
import styles from "./uploadNewVersion.module.css";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setModalState } from "../../../Redux/slices/filemanagerSlice";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdClose, IoMdImage } from "react-icons/io";
import { BsCheck } from "react-icons/bs";

const UploadNewVersion = () => {
  const dispatch = useDispatch();
  const { uploadNewVersion } = useSelector((state) => state.filemanager);

  const [shareChecks, setShareChecks] = useState([]);
  return (
    <Modal show={uploadNewVersion} centered>
      <Modal.Header className={styles.heading}>Upload New Version</Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between mb-2">
          <div className={styles.smallHeading}>Uploaded file</div>
          <div className={styles.addMore}>+ Add more</div>
        </div>
        <div className={styles.fileContainer}>
          <div className={styles.filePill}>
            <img src={pdfIcon} alt="" height={14} />
            <span className="mx-1" style={{ fontSize: "14px" }}>
              File
            </span>
            <IoMdClose />
          </div>
        </div>
        <div className={styles.smallHeading}>Share for Approval</div>
        <div>
          <div className="d-flex align-items-center" style={{ userSelect: "none" }}>
            <div
              className={`${styles.checkBox} ${shareChecks.includes("client") && styles.activeCheckBox}`}
              onClick={() => {
                if (shareChecks.includes("client")) {
                  let x = shareChecks.filter((curElem) => {
                    return curElem !== "client";
                  });
                  setShareChecks([...x]);
                } else {
                  setShareChecks((prev) => {
                    return [...prev, "client"];
                  });
                }
              }}
            >
              <BsCheck color="#ffffff" />
            </div>
            <div
              style={{ fontSize: "12px", cursor: "pointer" }}
              onClick={() => {
                if (shareChecks.includes("client")) {
                  let x = shareChecks.filter((curElem) => {
                    return curElem !== "client";
                  });
                  setShareChecks([...x]);
                } else {
                  setShareChecks((prev) => {
                    return [...prev, "client"];
                  });
                }
              }}
            >
              Client
            </div>
          </div>
          <div className="d-flex align-items-center" style={{ userSelect: "none" }}>
            <div
              className={`${styles.checkBox} ${shareChecks.includes("internal") && styles.activeCheckBox}`}
              onClick={() => {
                if (shareChecks.includes("internal")) {
                  let x = shareChecks.filter((curElem) => {
                    return curElem !== "internal";
                  });
                  setShareChecks([...x]);
                } else {
                  setShareChecks((prev) => {
                    return [...prev, "internal"];
                  });
                }
              }}
            >
              <BsCheck color="#ffffff" />
            </div>
            <div
              style={{ fontSize: "12px", cursor: "pointer" }}
              onClick={() => {
                if (shareChecks.includes("internal")) {
                  let x = shareChecks.filter((curElem) => {
                    return curElem !== "internal";
                  });
                  setShareChecks([...x]);
                } else {
                  setShareChecks((prev) => {
                    return [...prev, "internal"];
                  });
                }
              }}
            >
              Internal Team
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className={styles.noButton} onClick={() => dispatch(setModalState({ modal: "uploadNewVersion", state: false }))}>
          Cancel
        </button>
        <button className={styles.yesButton}>Update</button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadNewVersion;
