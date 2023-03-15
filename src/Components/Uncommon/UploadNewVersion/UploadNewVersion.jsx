import React, { useEffect, useState } from "react";
import styles from "./uploadNewVersion.module.css";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveFileToNewVersion, setModalState } from "../../../Redux/slices/filemanagerSlice";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdClose, IoMdImage } from "react-icons/io";
import { BsCheck } from "react-icons/bs";
import { postReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getFiles } from "../../../Services/commonFunctions";

const UploadNewVersion = () => {
  const dispatch = useDispatch();
  const { uploadNewVersion, fileToNewVersion } = useSelector((state) => state.filemanager);

  const [shareChecks, setShareChecks] = useState([]);

  const updateFileVersion = async () => {
    const obj = {
      fileName: fileToNewVersion[0].file.fileName,
      fileLink: fileToNewVersion[0].file.fileLink,
      fileType: fileToNewVersion[0].file.fileType,
      fileSize: fileToNewVersion[0].file.fileSize,
      type: 1,
      spaceName: fileToNewVersion[0].file.spaceName ? fileToNewVersion[0].file.spaceName : "",
      drawingType: fileToNewVersion[0].file.drawingType ? fileToNewVersion[0].file.drawingType : "",
    };
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/upload-new-version?id=${fileToNewVersion[0].container._id}&fileId=${fileToNewVersion[0].file._id}`, obj);
    if (res && !res.error) {
      getFiles(1);
      dispatch(setModalState({ modal: "uploadNewVersion", state: false }));
      dispatch(saveFileToNewVersion(fileToNewVersion[0]));
    } else {
      console.log(res.error);
    }
  };
  useEffect(() => {
    if (fileToNewVersion.length === 0) {
      dispatch(setModalState({ modal: "uploadNewVersion", state: false }));
    }
  }, [fileToNewVersion]);
  return (
    <Modal show={uploadNewVersion} centered>
      <Modal.Header className={styles.heading}>Upload New Version</Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between mb-2">
          <div className={styles.smallHeading}>Uploaded file</div>
        </div>
        <div className={styles.fileContainer}>
          {fileToNewVersion[0] && (
            <div className={styles.filePill} onClick={() => dispatch(saveFileToNewVersion(fileToNewVersion[0]))}>
              {fileToNewVersion[0].file.fileType.split("/")[0] === "image" ? <IoMdImage color="#26AD74" /> : <img src={pdfIcon} alt="" height={14} />}
              <span className="mx-1" style={{ fontSize: "14px" }}>
                {fileToNewVersion[0] && fileToNewVersion[0].file.fileName}
              </span>
              <IoMdClose />
            </div>
          )}
        </div>
        <div className={`${styles.smallHeading} mb-2`}>Share for Approval</div>
        <div className="d-flex">
          <div className="d-flex align-items-center me-2" style={{ userSelect: "none" }}>
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
        <button
          className={styles.noButton}
          onClick={() => {
            dispatch(setModalState({ modal: "uploadNewVersion", state: false }));
            dispatch(saveFileToNewVersion(fileToNewVersion[0]));
          }}
        >
          Cancel
        </button>
        <button className={styles.yesButton} onClick={updateFileVersion}>
          Update
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadNewVersion;
