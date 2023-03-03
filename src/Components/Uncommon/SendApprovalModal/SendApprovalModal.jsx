import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { BsCheck, BsChevronDown } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sendApprovalModal.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdClose } from "react-icons/io";
import { setModalState, saveArrayForApproval, clearArrayForApproval } from "../../../Redux/slices/filemanagerSlice";

const SendApprovalModal = () => {
  const dispatch = useDispatch();
  const { sendApprovalModal, arrayForApproval, filesGoingFor } = useSelector((state) => state.filemanager);
  const [notify, setNotify] = useState(false);

  const removeFiles = (item) => {
    dispatch(saveArrayForApproval(item));
  };
  return (
    <Modal show={sendApprovalModal} centered size="lg">
      <Modal.Header className={styles.heading}>{filesGoingFor === "approval" ? "New Approval Request" : "Send for Execution"}</Modal.Header>
      <Modal.Body>
        <div className="mb-2">{filesGoingFor === "approval" ? "Approval from" : "Send to"}</div>
        <Dropdown>
          <Dropdown.Toggle className={`${styles.selectMember} no-drop-arrow`}>
            <span>Select</span>
            <BsChevronDown />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Hello</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="d-flex justify-content-between align-items-center my-2">
          <div>Selected File</div>
          <div
            style={{ fontSize: "12px", color: "#003566", cursor: "pointer", fontWeight: "500" }}
            onClick={() => {
              dispatch(setModalState({ modal: "sendApprovalModal", state: false }));
              dispatch(setModalState({ modal: "uploadFileModal", state: true }));
            }}
          >
            + Add more
          </div>
        </div>
        <div className={styles.filePillContainer}>
          {arrayForApproval &&
            arrayForApproval.map((curElem) => {
              return (
                <div className={styles.filePill} title={curElem.file.fileName} onClick={() => removeFiles(curElem)}>
                  <img src={pdfIcon} alt="" height={15} />
                  <span className="mx-1" style={{ width: "80%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {curElem.file.fileName}
                  </span>
                  <IoMdClose />
                </div>
              );
            })}
        </div>
        {notify && (
          <>
            <div className="mt-2">Select Channels</div>
            <div className="d-flex w-100 flex-wrap my-2">
              <div className={styles.channelPill}>channel name</div>
              <div className={styles.channelPill}>channel name</div>
            </div>
            <div>Message</div>
            <div className={styles.messageBox}>
              <textarea rows={4}></textarea>
            </div>
          </>
        )}
        <div className="d-flex justify-content-between mt-2">
          <div className="d-flex align-items-center" style={{ userSelect: "none" }}>
            <div className={`${styles.checkBox} ${notify && styles.activeCheckBox}`} onClick={() => setNotify(!notify)}>
              <BsCheck color="#ffffff" />
            </div>
            <div style={{ fontSize: "12px", cursor: "pointer" }} onClick={() => setNotify(!notify)}>
              Notify in chat
            </div>
          </div>
          <div className="d-flex">
            <button
              className={styles.cancelButton}
              onClick={() => {
                dispatch(clearArrayForApproval());
                dispatch(setModalState({ modal: "sendApprovalModal", state: false }));
                dispatch(setModalState({ modal: "uploadFileModal", state: true }));
              }}
            >
              Cancel
            </button>
            <button className={styles.sendButton}>Send</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SendApprovalModal;
