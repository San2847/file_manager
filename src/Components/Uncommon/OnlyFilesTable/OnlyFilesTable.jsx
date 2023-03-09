import React, { useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { useSelector } from "react-redux";
import LoadingSekeleton from "../../Common/LoadingSkeleton/LoadingSekeleton";
import styles from "./onlyFilesTable.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdImage } from "react-icons/io";
import { createDateString } from "../../../Services/commonFunctions";

const OnlyFilesTable = ({ fileData }) => {
  const { detailsVersionTab, loading } = useSelector((state) => state.filemanager);
  const [addedFilesArr, setAddedFilesArr] = useState([]);

  const checkboxSelectUnselect = (elem) => {
    if (!addedFilesArr.includes(elem._id)) {
      setAddedFilesArr((prev) => {
        return [...prev, elem._id];
      });
    } else {
      let x = addedFilesArr.filter((curElem) => {
        return curElem !== elem._id;
      });
      setAddedFilesArr([...x]);
    }
  };
  return (
    <>
      <div className="d-flex mb-2 px-2">
        <div style={{ width: detailsVersionTab === "" ? "25%" : "50%", fontSize: "12px", color: "#333333", fontWeight: "500", paddingLeft: "1.5rem", display: "flex", alignItems: "center" }}>
          Name
          <AiOutlineArrowUp />
        </div>
        {detailsVersionTab === "" && (
          <>
            <div style={{ width: "15%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>Space Name</div>
            <div style={{ width: "15%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>Drawing Type</div>
          </>
        )}
        <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>Last Updated</div>
        <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>Status</div>
        {detailsVersionTab === "" && <div style={{ width: "10%", fontSize: "12px", color: "#333333", fontWeight: "500", display: "flex", justifyContent: "center" }}>Feedback</div>}
        <div style={{ width: detailsVersionTab === "" ? "5%" : "10%" }}></div>
      </div>

      <div className={styles.fileCardContainer}>
        <div style={{ height: "fit-content" }}>
          {loading ? (
            <LoadingSekeleton />
          ) : (
            fileData &&
            fileData.map((curElem) => {
              return (
                <div className={styles.eachCard}>
                  <div style={{ width: detailsVersionTab === "" ? "25%" : "50%", fontSize: "12px", color: "#333333", fontWeight: "500", paddingLeft: "0.5rem", display: "flex", alignItems: "center" }}>
                    <div
                      className={addedFilesArr.includes(curElem._id) ? styles.activeCheckbox : styles.customCheckbox}
                      onClick={(event) => {
                        event.stopPropagation();
                        checkboxSelectUnselect(curElem);
                      }}
                    >
                      <BsCheck />
                    </div>
                    <div className="me-2">
                      {curElem.fileType.split("/")[0] ? (
                        curElem.fileType.split("/")[0] === "image" ? (
                          <IoMdImage fontSize={20} color="#26AD74" />
                        ) : (
                          <img src={pdfIcon} alt="" />
                        )
                      ) : (
                        <img src={pdfIcon} alt="" />
                      )}
                    </div>
                    <a href={curElem.fileLink} target="_blank" title={curElem.fileName} className={styles.fileName}>
                      {curElem.fileName}
                    </a>
                  </div>
                  {detailsVersionTab === "" && (
                    <>
                      <div style={{ width: "15%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>{curElem.spaceName ? curElem.spaceName : "-"}</div>
                      <div style={{ width: "15%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>{curElem.drawingType ? curElem.drawingType : "-"}</div>
                    </>
                  )}
                  <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>
                    {curElem.updateTime ? createDateString(curElem.updateTime) : "-"}
                  </div>
                  <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>{curElem.status === 0 ? "Approval Pending" : "-"}</div>
                  {detailsVersionTab === "" && <div style={{ width: "10%", fontSize: "12px", color: "#333333", fontWeight: "500", display: "flex", justifyContent: "center" }}>Feedback</div>}
                  <div style={{ width: detailsVersionTab === "" ? "5%" : "10%" }}></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default OnlyFilesTable;
