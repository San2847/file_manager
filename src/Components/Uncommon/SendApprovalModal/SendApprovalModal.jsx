import React, { useEffect, useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { BsCheck, BsChevronDown } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import styles from "./sendApprovalModal.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdClose } from "react-icons/io";
import { setModalState, saveArrayForApproval, clearArrayForApproval, inputNotifyMessage } from "../../../Redux/slices/filemanagerSlice";
import { postReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getFiles, saveFileChangesAsVersion } from "../../../Services/commonFunctions";
import { getUserId } from "../../../Services/authService";

const SendApprovalModal = () => {
  const dispatch = useDispatch();
  const { sendApprovalModal, arrayForApproval, filesGoingFor, teamMemberArray, notifyMessage, profileData } = useSelector((state) => state.filemanager);
  const [notify, setNotify] = useState(false);

  const [selectedTeamMember, setSelectedTeamMember] = useState({});

  const submitFilesForApprovalOrExecution = async () => {
    if (Object.keys(selectedTeamMember).length > 0) {
      const obj = {};
      if (filesGoingFor === "approval") {
        obj["approvalRequestTo"] = selectedTeamMember.memberId;
        obj["approvalRequestName"] = selectedTeamMember.memberName;
      } else {
        obj["executionRequestTo"] = selectedTeamMember.memberId;
        obj["executionRequestName"] = selectedTeamMember.memberName;
      }
      let arr = [];
      arrayForApproval.forEach((curElem) => {
        arr.push({ id: curElem.container._id, fileId: curElem.file._id });
      });
      obj["files"] = arr;
      if (filesGoingFor === "approval") {
        const res = await postReq(`${apiLinks.pmt}/api/file-manager/send-file-approval`, obj);
        if (res && !res.error) {
          dispatch(clearArrayForApproval());
          dispatch(setModalState({ modal: "sendApprovalModal", state: false }));
          setSelectedTeamMember({});
          saveFileChangesAsVersion({ container: arrayForApproval[0].container, file: arrayForApproval[0].file, text: `File sent for approval to ${selectedTeamMember.memberName}` });
          getFiles(1);
        } else {
          console.log(res.error);
        }
      } else {
        if (notifyMessage) {
          const res = await postReq(`${apiLinks.pmt}/api/file-manager/send-file-execution`, obj);
          if (res && !res.error) {
            dispatch(clearArrayForApproval());
            dispatch(setModalState({ modal: "sendApprovalModal", state: false }));
            setSelectedTeamMember({});
            saveFileChangesAsVersion({
              container: arrayForApproval[0].container,
              file: arrayForApproval[0].file,
              text: `File sent for execution to ${selectedTeamMember.memberName} because ${notifyMessage}`,
            });
            arr.forEach(async (curel) => {
              const feedRes = await postReq(`${apiLinks.pmt}/api/file-manager/send-feedback?id=${curel.container._id}&fileId=${curel.file._id}`, {
                sendBy: getUserId(),
                message: `${notifyMessage}~-+-~${profileData.fullName}`,
              });
            });
            getFiles(3);
          } else {
            console.log(res.error);
          }
        }
      }
    }
  };

  const inputMessage = (event) => {
    dispatch(inputNotifyMessage(event.target.value));
  };

  const removeFiles = (item) => {
    dispatch(saveArrayForApproval(item));
  };

  useEffect(() => {
    if (filesGoingFor === "execution") {
      setNotify(true);
    }
  }, [filesGoingFor]);
  return (
    <Modal show={sendApprovalModal} centered size="lg">
      <Modal.Header className={styles.heading}>{filesGoingFor === "approval" ? "New Approval Request" : "Send for Execution"}</Modal.Header>
      <Modal.Body>
        <div className="mb-2">{filesGoingFor === "approval" ? "Approval from" : "Send to"}</div>
        <Dropdown>
          <Dropdown.Toggle className={`${styles.selectMember} no-drop-arrow`}>
            <span>{Object.keys(selectedTeamMember).length > 0 ? selectedTeamMember.memberName : "Select team member"}</span>
            <BsChevronDown />
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            {teamMemberArray &&
              teamMemberArray.map((curElem) => {
                return <Dropdown.Item onClick={() => setSelectedTeamMember(curElem)}>{curElem.memberName}</Dropdown.Item>;
              })}
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
            {filesGoingFor !== "execution" && (
              <>
                <div className="mt-2">Select Channels</div>
                <div className="d-flex w-100 flex-wrap my-2">
                  <div className={styles.channelPill}>channel name</div>
                  <div className={styles.channelPill}>channel name</div>
                </div>
              </>
            )}
            <div>Message</div>
            <div className={styles.messageBox}>
              <textarea rows={4} value={notifyMessage} onChange={inputMessage}></textarea>
            </div>
          </>
        )}
        <div className="d-flex justify-content-between mt-2">
          <div className="d-flex align-items-center" style={{ userSelect: "none" }}>
            {filesGoingFor !== "execution" && (
              <>
                <div className={`${styles.checkBox} ${notify && styles.activeCheckBox}`} onClick={() => setNotify(!notify)}>
                  <BsCheck color="#ffffff" />
                </div>
                <div style={{ fontSize: "12px", cursor: "pointer" }} onClick={() => setNotify(!notify)}>
                  Notify in chat
                </div>
              </>
            )}
          </div>
          <div className="d-flex">
            <button
              className={styles.cancelButton}
              onClick={() => {
                dispatch(clearArrayForApproval());
                dispatch(setModalState({ modal: "sendApprovalModal", state: false }));
                // dispatch(setModalState({ modal: "uploadFileModal", state: true }));
              }}
            >
              Cancel
            </button>
            <button className={styles.sendButton} onClick={submitFilesForApprovalOrExecution}>
              Send
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SendApprovalModal;
