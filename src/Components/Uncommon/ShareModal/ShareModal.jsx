import React from "react";
import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import styles from "./shareModal.module.css";
import mailIcon from "../../../Assets/ShareModalIcons/mailIcon.svg";
import whatsapp from "../../../Assets/ShareModalIcons/whatsapp.svg";
import person from "../../../Assets/ShareModalIcons/person.svg";
import team from "../../../Assets/ShareModalIcons/team.svg";
import { setModalState } from "../../../Redux/slices/filemanagerSlice";

const ShareModal = () => {
  const dispatch = useDispatch();
  const { shareModal, filesToBeSharedArr } = useSelector((state) => state.filemanager);
  console.log(filesToBeSharedArr);
  return (
    <Modal show={shareModal} centered>
      <Modal.Body>
        <div className="d-flex justify-content-between">
          <div className={styles.heading}>Share</div>
          <div style={{ cursor: "pointer" }} onClick={() => dispatch(setModalState({ modal: "shareModal", state: false }))}>
            <AiOutlineClose />
          </div>
        </div>
        <div className={styles.linkContainerDiv}>
          <div style={{ whiteSpace: "nowrap", overflow: "scroll", width: "78%" }}>
            {filesToBeSharedArr &&
              filesToBeSharedArr.map((curElem, index) => {
                if (index === filesToBeSharedArr.length - 1) {
                  return `${curElem.file.fileLink}`;
                } else {
                  return `${curElem.file.fileLink},`;
                }
              })}
          </div>
          <button>Copy Link</button>
        </div>
        <div className="d-flex">
          <div className={styles.eachIconContainer}>
            <img src={mailIcon} alt="" />
            <div>E-Mail</div>
          </div>
          <div className={styles.eachIconContainer}>
            <img src={whatsapp} alt="" />
            <div>Whatsapp</div>
          </div>
          <div className={styles.eachIconContainer}>
            <img src={person} alt="" />
            <div>Client</div>
          </div>
          <div className={styles.eachIconContainer}>
            <img src={team} alt="" />
            <div>Internal Team</div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
