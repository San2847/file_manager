import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { changeDetVerTab, handleDetailsVersionBox } from "../../../Redux/slices/filemanagerSlice";
import styles from "./fileDetailsAndVersion.module.css";

const FileDetailsAndVersion = () => {
  const disptach = useDispatch();
  const { detailsVersionTab } = useSelector((state) => state.filemanager);
  return (
    <div className={styles.container}>
      <div className={styles.headingTabs}>
        <div className={styles.heading}>
          <div className={styles.headingName}>BOQ 1</div>
          <div className={styles.closeButton} onClick={() => disptach(handleDetailsVersionBox({ item: {}, tab: "" }))}>
            <AiOutlineClose />
          </div>
        </div>
        <div className={styles.tabsContainer}>
          <div className={`${styles.eachTab} ${detailsVersionTab === "details" && styles.activeTab}`} onClick={() => disptach(changeDetVerTab("details"))}>Details</div>
          <div className={`${styles.eachTab} ${detailsVersionTab === "version" && styles.activeTab}`} onClick={() => disptach(changeDetVerTab("version"))}>Version History</div>
        </div>
      </div>
      <div className={styles.content}>content</div>
    </div>
  );
};

export default FileDetailsAndVersion;
