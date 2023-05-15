import React, { useEffect, useState } from "react";
import styles from "./uploadNewVersion.module.css";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { cleanNewFileForVersion, saveFileToNewVersion, setModalState } from "../../../Redux/slices/filemanagerSlice";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdClose, IoMdImage } from "react-icons/io";
import { BsCheck } from "react-icons/bs";
import { postReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getFiles, saveFileChangesAsVersion } from "../../../Services/commonFunctions";
import { useParams } from "react-router-dom";

const UploadNewVersion = () => {
  const dispatch = useDispatch();
  const { uploadNewVersion, fileToNewVersion, newFileForVersion, feedbackTempArr } = useSelector((state) => state.filemanager);

  const { id } = useParams();

  const [shareChecks, setShareChecks] = useState([]);
  console.log({ feedbackTempArr })
  const updateFileVersion = async () => {
    const obj = {
      fileName: newFileForVersion.fileName,
      fileLink: newFileForVersion.fileLink,
      fileType: newFileForVersion.fileType,
      fileSize: newFileForVersion.fileSize,
      type: 1,
      uuId: fileToNewVersion[0].file.uuId,
      feedBack: feedbackTempArr.map((item) => item.feedBack[0]),
    };
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/upload-new-version?id=${fileToNewVersion[0].container._id}&fileId=${fileToNewVersion[0].file._id}`, obj);
    if (res && !res.error) {
      saveFileChangesAsVersion({ container: fileToNewVersion[0].container, file: obj, text: "is the new version" }, fileToNewVersion[0].file.uuid, id);
      getFiles(1, id);
      dispatch(setModalState({ modal: "uploadNewVersion", state: false }));
      dispatch(setModalState({ modal: "versionConfirmation", state: false }));
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
          {Object.keys(newFileForVersion).length > 0 && (
            <div className={styles.filePill} onClick={() => dispatch(cleanNewFileForVersion())}>
              {newFileForVersion.fileType && newFileForVersion.fileType.split("/")[0] === "image" ? <IoMdImage color="#26AD74" /> : <img src={pdfIcon} alt="" height={14} />}
              <span className="mx-1" style={{ fontSize: "14px", width: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {newFileForVersion && newFileForVersion.fileName}
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
            dispatch(cleanNewFileForVersion());
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
