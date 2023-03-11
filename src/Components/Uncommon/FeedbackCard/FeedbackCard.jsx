import React, { useState } from "react";
import styles from "./feedbackCard.module.css";
import feedbackIcon from "../../../Assets/feedbackIcon.svg";
import { createDateString } from "../../../Services/commonFunctions";

const FeedbackCard = ({ feedData, currentVer, name }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  return (
    <>
      <div className={currentVer ? styles.firstFeedback : styles.eachFeedback} onClick={() => setShowReplyBox(!showReplyBox)}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
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
            <div style={{ fontSize: "16px", fontWeight: "500", marginRight: "0.5rem" }}>{name}</div>
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
                }}
              >
                Current Version
              </div>
            )}
          </div>
          <div style={{ fontSize: "10px", color: "#333333CC" }}>{feedData ? createDateString(feedData.dateTime) : ""}</div>
        </div>
        <div style={{ fontSize: "14px" }}>{feedData && feedData.message}</div>
      </div>
      {currentVer && (
        <div className={`${styles.replyBox} ${showReplyBox ? styles.activeReplyBox : styles.inactiveReplyBox}`}>
          <div>
            <div className={styles.replyInput}>
              <textarea rows="4"></textarea>
              <div className={styles.sendForApproval}>
                <input className="me-2" type="checkbox" />
                Send for approval
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button className={styles.outlineButton}>Upload New Version</button>
              <button className={styles.submitButton}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackCard;
