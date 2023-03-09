import React from "react";
import styles from "./feedbackCard.module.css";
import feedbackIcon from "../../../Assets/feedbackIcon.svg";
import { createDateString } from "../../../Services/commonFunctions";

const FeedbackCard = ({ feedData, currentVer }) => {
  return (
    <div className={styles.eachFeedback}>
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
          <div style={{ fontSize: "16px", fontWeight: "500", marginRight: "0.5rem" }}>BOQ 1</div>
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
  );
};

export default FeedbackCard;
