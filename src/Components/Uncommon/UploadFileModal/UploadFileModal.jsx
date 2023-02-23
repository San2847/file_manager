import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { BsCheck } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import styles from "./uploadFileModal.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdImage } from "react-icons/io";
import { setModalState } from "../../../Redux/slices/filemanagerSlice";

const UploadFileModal = () => {
  const dispatch = useDispatch();
  const { uploadFileModal } = useSelector((state) => state.filemanager);
  const [tabState, setTabState] = useState("drive");
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
            <div style={{ width: "30%", fontSize: "12px", display: "flex", justifyContent: "center" }}>Name</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center" }}>Space Name</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center" }}>Drawing Type</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center" }}>Date Added</div>
            <div style={{ width: "17.5%", fontSize: "12px", display: "flex", justifyContent: "center" }}>Last Modified</div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.eachCard}>
              <div style={{ width: "30%", fontSize: "14px", display: "flex", alignItems: "center", paddingLeft: "0.5rem" }}>
                <div className={`${styles.checkBox} ${styles.activeBox}`}>
                  <BsCheck />
                </div>
                <div className="d-flex align-items-center">
                  <FaFolder style={{ marginRight: "0.5rem" }} color="#F2B007" />
                  Name
                </div>
              </div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Space Name</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Drawing Type</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Date Added</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Last Modified</div>
            </div>

            <div className={styles.eachCard}>
              <div style={{ width: "30%", fontSize: "14px", display: "flex", alignItems: "center", paddingLeft: "0.5rem" }}>
                <div className={`${styles.checkBox} ${styles.activeBox}`}>
                  <BsCheck />
                </div>
                <div className="d-flex align-items-center">
                  <IoMdImage style={{ marginRight: "0.5rem" }} color="#26AD74" />
                  Name
                </div>
              </div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Space Name</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Drawing Type</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Date Added</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Last Modified</div>
            </div>

            <div className={styles.eachCard}>
              <div style={{ width: "30%", fontSize: "14px", display: "flex", alignItems: "center", paddingLeft: "0.5rem" }}>
                <div className={`${styles.checkBox} ${styles.activeBox}`}>
                  <BsCheck />
                </div>
                <div className="d-flex align-items-center">
                  <img src={pdfIcon} alt="" style={{ marginRight: "0.5rem", height: "15px" }} />
                  Name
                </div>
              </div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Space Name</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Drawing Type</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Date Added</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Last Modified</div>
            </div>

            <div className={styles.eachCard}>
              <div style={{ width: "30%", fontSize: "14px", display: "flex", alignItems: "center", paddingLeft: "0.5rem" }}>
                <div className={`${styles.checkBox} ${styles.activeBox}`}>
                  <BsCheck />
                </div>
                <div className="d-flex align-items-center">
                  <img src={pdfIcon} alt="" style={{ marginRight: "0.5rem", height: "15px" }} />
                  Name
                </div>
              </div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Space Name</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Drawing Type</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Date Added</div>
              <div style={{ width: "17.5%", fontSize: "14px", display: "flex", justifyContent: "center", color: "#333333CC" }}>Last Modified</div>
            </div>
          </div>
        </div>
        <div className="py-2 w-100 d-flex justify-content-end">
          <button className={styles.cancelButton} onClick={() => dispatch(setModalState({ modal: "uploadFileModal", state: false }))}>
            Cancel
          </button>
          <button className={styles.selectButton}>Select an Item</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UploadFileModal;
