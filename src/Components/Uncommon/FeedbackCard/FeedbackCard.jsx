import React, { useState } from "react";
import styles from "./feedbackCard.module.css";
import feedbackIcon from "../../../Assets/feedbackIcon.svg";
import { createDateString, getFiles } from "../../../Services/commonFunctions";
import { postReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getUserId } from "../../../Services/authService";

const FeedbackCard = ({ feedData, currentVer, name, containerAndFile, uploadNewVersionFunc, profileData }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const sendReply = async () => {
    if (replyText) {
      const res = await postReq(`${apiLinks.pmt}/api/file-manager/reply-feedback?id=${containerAndFile.container._id}&fileId=${containerAndFile.file._id}&feedbackId=${feedData._id}`, {
        sendBy: getUserId(),
        message: `${replyText}~-+-~${profileData.fullName}`,
      });
      if (res && !res.error) {
        getFiles(1);
      } else {
        console.log(res.error);
      }
    }
  };
  return (
    <>
      <div className={currentVer ? styles.firstFeedback : styles.eachFeedback} onClick={() => setShowReplyBox(!showReplyBox)}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center" style={{ width: "90%" }}>
            <div
              style={{
                backgroundColor: "#C781FF",
                borderRadius: "4px",
                height: "1.5rem",
                width: "1.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "0.5rem",
              }}
            >
              <img src={feedbackIcon} alt="" style={{ height: "0.9rem" }} />
            </div>
            <div style={{ fontSize: "16px", fontWeight: "500", marginRight: "0.5rem", maxWidth: "60%", whiteSpace: "nowrap", overflowX: "hidden", textOverflow: "ellipsis" }}>{name}</div>
            {currentVer && (
              <div
                style={{
                  backgroundColor: "#D6D8FF",
                  padding: "0 1rem",
                  borderRadius: "30px",
                  fontSize: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#484FFB",
                  marginRight: "0.5rem",
                }}
              >
                Current Version
              </div>
            )}
            {feedData.message.split && feedData.message.split("~-+-~")[1] && (
              <div
                style={{
                  backgroundColor: "#C0F1DD",
                  padding: "0 1rem",
                  borderRadius: "30px",
                  fontSize: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#26AD74",
                }}
              >
                {feedData && feedData.message.split("~-+-~") ? feedData.message.split("~-+-~")[1] : ""}
              </div>
            )}
          </div>
          <div style={{ fontSize: "10px", color: "#333333CC" }}>{feedData ? createDateString(feedData.dateTime) : ""}</div>
        </div>
        <div style={{ fontSize: "14px" }}>{feedData && feedData.message.split("~-+-~") ? feedData.message.split("~-+-~")[0] : ""}</div>
        {feedData.feedBackReply &&
          feedData.feedBackReply.map((curElem) => {
            return (
              <div className={styles.eachReplyContainer}>
                <div className={styles.eachReply}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <div className={styles.replyHeading}>Comment on this reply</div>
                      {curElem.message && curElem.message.split("~-+-~") && (
                        <div
                          style={{
                            backgroundColor: "#E6CCFF",
                            padding: "0 1rem",
                            borderRadius: "30px",
                            fontSize: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#A041FF",
                          }}
                        >
                          {curElem.message.split("~-+-~")[1] ? curElem.message.split("~-+-~")[1] : ""}
                        </div>
                      )}
                    </div>
                    <div className={styles.replyDate}>{createDateString(curElem.dateTime)}</div>
                  </div>
                  <div className={styles.replyText}>{curElem.message && curElem.message.split("~-+-~") ? curElem.message.split("~-+-~")[0] : ""}</div>
                </div>
              </div>
            );
          })}
      </div>

      {currentVer && (
        <div className={`${styles.replyBox} ${showReplyBox ? styles.activeReplyBox : styles.inactiveReplyBox}`}>
          <div>
            <div className={styles.replyInput}>
              <textarea rows="4" value={replyText} onChange={(event) => setReplyText(event.target.value)}></textarea>
              {/* <div className={styles.sendForApproval}>
                <input className="me-2" type="checkbox" />
                Send for approval
              </div> */}
            </div>
            <div className="d-flex justify-content-end">
              <button className={styles.outlineButton} onClick={() => uploadNewVersionFunc(containerAndFile.container, containerAndFile.file)}>
                Upload New Version
              </button>
              <button className={styles.submitButton} onClick={sendReply}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackCard;
