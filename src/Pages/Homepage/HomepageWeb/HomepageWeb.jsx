import React, { useEffect, useRef, useState, version } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../../Components/Common/Breadcrumb/Breadcrumb";
import {
  clearAllEmptyFiles,
  clearFileCheckbox,
  saveArrayForApproval,
  saveFilesToBeShared,
  savePrepareDeleteArr,
  saveProjectId,
  selectFileTypeTab,
  selectInternalTab,
  setFilesGoingFor,
  setFileUploadProgress,
  setModalState,
} from "../../../Redux/slices/filemanagerSlice";
import styles from "./homepageWeb.module.css";
import FilesTable from "../../../Components/Uncommon/FilesTable/FilesTable";
import FileDetailsAndVersion from "../../../Components/Uncommon/FileDetailsAndVersion/FileDetailsAndVersion";
import { AiOutlineDownload, AiOutlineFile } from "react-icons/ai";
import { RiFolder2Line } from "react-icons/ri";
import UploadFileModal from "../../../Components/Uncommon/UploadFileModal/UploadFileModal";
import { postReq, putReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getProjectId, getUserId } from "../../../Services/authService";
import uuid from "react-uuid";
import { downloadFile, getFiles, getFileStatus, saveFileChangesAsVersion } from "../../../Services/commonFunctions";
import OnlyFilesTable from "../../../Components/Uncommon/OnlyFilesTable/OnlyFilesTable";
import { BsBoxArrowInRight, BsShare } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteFilesModal from "../../../Components/Uncommon/DeleteFilesModal/DeleteFilesModal";
import SendApprovalModal from "../../../Components/Uncommon/SendApprovalModal/SendApprovalModal";
import VersionConfirmation from "../../../Components/Uncommon/VersionConfirmation/VersionConfirmation";
import UploadNewVersion from "../../../Components/Uncommon/UploadNewVersion/UploadNewVersion";
import MoveModal from "../../../Components/Uncommon/MoveModal/MoveModal";
import CreateFolderModal from "../../../Components/Uncommon/CreateFolderModal/CreateFolderModal";
import SelfApprovalConfirmationModal from "../../../Components/Uncommon/SelfApprovalConfirmationModal/SelfApprovalConfirmationModal";
import ShareModal from "../../../Components/Uncommon/ShareModal/ShareModal";
import { useParams } from "react-router-dom";
import FileLanding from "./FileLanding/FileLanding";

const HomepageWeb = () => {
  const dispatch = useDispatch();
  const { fileTypeTab, internalTab, detailsVersionTab, fileUploadProgress, fileFolderArr, onlyFilesArr, fileCheckBoxArr, allEmptyFiles } = useSelector((state) => state.filemanager);

  const { id } = useParams();

  const [clientFilesArr, setClientFilesArr] = useState([]);

  const statusObj = {
    all: 1,
    approved: 2,
    discussion: 0,
    execution: 3,
  };

  let user = "internal";

  const [disableDelete, setDisableDelete] = useState(false);

  const [uploadingFile, setUploadingFile] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const uploadFileRef = useRef(null);
  const uploadFolderRef = useRef(null);

  const uploadFile = async (event) => {
    const allFiles = fileFolderArr.map((curElem) => {
      if (!curElem.folderName) {
        return curElem.fileDetails[0].fileName;
      }
    });
    const { files } = event.target;
    setTotalFiles(files.length);
    for (let i = 0; i < files.length; i++) {
      setUploadingFile(i + 1);
      let filesToUpload = new FormData();
      filesToUpload.append("bucketName", `${process.env.REACT_APP_BUCKET_NAME}`);
      filesToUpload.append("files", event.target.files[i]);
      const res = await putReq(`${apiLinks.s3api}/api/upload`, filesToUpload);
      if (res && !res.error) {
        let sendingObj = {
          userId: getUserId(),
          projectId: id,
        };
        let eachFileObj = {};
        eachFileObj["uuId"] = uuid();
        eachFileObj["fileName"] = allFiles.includes(files[i].name) ? `${files[i].name}-copy` : files[i].name;
        eachFileObj["fileLink"] = res.data.locations[0];
        eachFileObj["fileType"] = files[i].type;
        eachFileObj["fileSize"] = `${Math.round(files[i].size / 1024)} KB`;
        eachFileObj["type"] = 1;
        sendingObj["fileDetails"] = [{ ...eachFileObj }];
        const upRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-details`, sendingObj);
        if (upRes && !upRes.error) {
          saveFileChangesAsVersion({ container: upRes.data, file: upRes.data.fileDetails[0], text: "has been uploaded." }, undefined, id);
        } else {
          console.log(upRes.error);
        }
        dispatch(setFileUploadProgress(0));
      } else {
        console.log(res.error);
      }
      if (i === files.length - 1) {
        setUploadingFile(0);
        getFiles(1, id);
      }
    }
  };

  const openDeleteModal = () => {
    dispatch(setModalState({ modal: "deleteModal", state: true }));
  };

  const uploadFolder = async (event) => {
    const allFolders = fileFolderArr.map((curElem) => {
      return curElem.folderName;
    });
    const { files } = event.target;
    setTotalFiles(files.length);
    const folderName = files[0].webkitRelativePath.split("/")[0];
    let sendObj = {
      userId: getUserId(),
      projectId: getProjectId(),
      folderName: allFolders.includes(folderName) ? `${folderName}-copy` : folderName,
    };
    let arr = [];
    for (let i = 0; i < files.length; i++) {
      setUploadingFile(i + 1);
      let filesToUpload = new FormData();
      filesToUpload.append("bucketName", `${process.env.REACT_APP_BUCKET_NAME}`);
      filesToUpload.append("files", event.target.files[i]);
      const res = await putReq(`${apiLinks.s3api}/api/upload`, filesToUpload);
      if (res && !res.error) {
        let eachFileObj = {};
        eachFileObj["uuId"] = uuid();
        eachFileObj["fileName"] = files[i].name ? files[i].name : "File";
        eachFileObj["fileLink"] = res.data.locations[0];
        eachFileObj["fileType"] = files[i].type;
        eachFileObj["fileSize"] = `${Math.round(files[i].size / 1024)} KB`;
        eachFileObj["type"] = 1;
        arr.push(eachFileObj);
      } else {
        console.log(res.error);
      }
      if (i === files.length - 1) {
        setUploadingFile(0);
        getFiles(1, id);
        sendObj["fileDetails"] = [...arr];
        const upRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-details`, sendObj);
        if (upRes && !upRes.error) {
          saveFileChangesAsVersion({ container: upRes.data, file: upRes.data.fileDetails, text: "has been uploaded" }, undefined, id);
        } else {
          console.log(upRes.error);
        }
      }
    }
  };

  const createEmptyFolder = async () => {
    dispatch(setModalState({ modal: "createFolderModal", state: true }));
  };

  const deleteEmptyFile = async (fileContainerId) => {
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/delete-folder?id=${fileContainerId}`);
    if (res && !res.error) {
      getFiles(1, id);
    } else {
      console.log(res.error);
    }
  };

  const sendAllToExecution = () => {
    dispatch(setFilesGoingFor("execution"));
    fileCheckBoxArr.forEach((cur) => {
      dispatch(saveArrayForApproval({ container: cur.container, file: cur.fileOrFold }));
    });
    dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
  };

  const [sendExecButtonShow, setSendExecButtonShow] = useState(false);
  useEffect(() => {
    if (fileCheckBoxArr) {
      let x =
        fileCheckBoxArr.length > 0
          ? fileCheckBoxArr.every((curElem) => {
            return !curElem.fileOrFold.isSendForExecution;
          })
          : false;
      setSendExecButtonShow(x);
    }
  }, [fileCheckBoxArr]);

  useEffect(() => {
    if (fileTypeTab && id) {
      getFiles(statusObj[fileTypeTab], id);
    }
    dispatch(clearFileCheckbox());
  }, [fileTypeTab, id]);

  useEffect(() => {
    if (allEmptyFiles[0] && allEmptyFiles[0].length > 0) {
      allEmptyFiles[0].forEach((curElem, index) => {
        deleteEmptyFile(curElem._id);
      });
    }
  }, [allEmptyFiles, fileTypeTab]);

  useEffect(() => {
    if (fileCheckBoxArr) {
      let x = fileCheckBoxArr.some((curElem) => {
        return getFileStatus(curElem.fileOrFold) !== "-";
      });
      if (x) {
        setDisableDelete(true);
      } else {
        setDisableDelete(false);
      }
    }
  }, [fileCheckBoxArr]);

  useEffect(() => {
    if (id) {
      dispatch(saveProjectId(id));
    }
  }, [id]);

  return id ? (
    <>
      <SendApprovalModal />
      <UploadFileModal />
      <DeleteFilesModal />
      <VersionConfirmation />
      <UploadNewVersion />
      <MoveModal />
      <CreateFolderModal />
      <SelfApprovalConfirmationModal />
      <ShareModal />
      <div className="container-box">
        <div className={styles.container}>
          {/* multiple files selected option box */}
          <div className={styles.multipleFilesOptionBox} style={{ right: fileCheckBoxArr.length > 0 ? "5vw" : "-25vw" }}>
            <div className={styles.optionBoxText}>
              {fileCheckBoxArr.length} {fileCheckBoxArr.length > 1 ? "files" : "file"} selected
            </div>
            <div className="d-flex justify-content-between w-100">
              <div className={styles.eachOption}
                onClick={(event) => {
                  event.stopPropagation();
                  // dispatch(saveFilesToBeShared([{ container: fileCheckBoxArr.map((curElem) => curElem.container), file: fileCheckBoxArr.map((curElem) => curElem.fileOrFold) }]));
                  dispatch(saveFilesToBeShared(fileCheckBoxArr.map((curElem) => { return { container: curElem.container, file: curElem.fileOrFold } })));
                  dispatch(setModalState({ modal: "shareModal", state: true }));
                }}>
                <BsShare />
              </div>
              <div className={disableDelete ? styles.disabledOption : styles.eachOption} onClick={openDeleteModal}>
                <FaRegTrashAlt />
              </div>
              <div className={styles.eachOption} onClick={() => downloadFile(fileCheckBoxArr.map((item) => item.fileOrFold))}>
                <AiOutlineDownload fontSize={18} />
              </div>
              <div className={styles.eachOption} onClick={() => dispatch(setModalState({ modal: "moveModal", state: true }))}>
                <BsBoxArrowInRight fontSize={18} />
              </div>
            </div>
          </div>
          {/* multiple files selected option box */}
          <div className={styles.uploadingFilesBox} style={uploadingFile > 0 ? { height: "4rem" } : { height: "0" }}>
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
              <div className="mb-2">Uploading Files ({`${uploadingFile}/${totalFiles}`}):</div>
              <div style={{ height: "3px", width: "100%", backgroundColor: "#888888" }}>
                <div style={{ height: "100%", width: `${fileUploadProgress}%`, backgroundColor: "green" }}></div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <div className={styles.filesHeading}>Files</div>
              <div className="d-flex align-items-center">
                {sendExecButtonShow && (
                  <button className={`${styles.actionButtons} me-2`} onClick={sendAllToExecution}>
                    Send for Execution
                  </button>
                )}
                <button className={`${styles.actionButtons} me-2`} onClick={createEmptyFolder}>
                  Create Folder
                </button>
                <input className="d-none" ref={uploadFileRef} onChange={uploadFile} multiple type="file" name="" id="" />
                <input className="d-none" ref={uploadFolderRef} webkitdirectory="true" onChange={uploadFolder} type="file" name="" id="" />
                <Dropdown>
                  <Dropdown.Toggle className={styles.actionButtons}>New Upload</Dropdown.Toggle>
                  <Dropdown.Menu className="py-1">
                    <Dropdown.Item className="d-flex align-items-center px-2" style={{ fontSize: "14px" }} onClick={() => uploadFileRef.current.click()}>
                      <AiOutlineFile style={{ marginRight: "0.25rem" }} /> Upload File
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center px-2" style={{ fontSize: "14px" }} onClick={() => uploadFolderRef.current.click()}>
                      <RiFolder2Line style={{ marginRight: "0.25rem" }} /> Upload Folder
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <button
                  className={`${styles.actionButtons}`}
                  onClick={() => {
                    dispatch(setFilesGoingFor("approval"));
                    dispatch(setModalState({ modal: "uploadFileModal", state: true }));
                  }}
                >
                  Get New Approval
                </button>
              </div>
            </div>
            <div className="d-flex align-items-start">
              <Breadcrumb
                pathArr={JSON.stringify([
                  { label: "Home", link: "" },
                  { label: "Files", navTo: "" },
                ])}
              />
            </div>
          </div>

          <div className={styles.tabContainer}>
            <div className={styles.allTabs}>
              <div className={fileTypeTab === "all" ? styles.activeTab : styles.inactiveTab} onClick={() => dispatch(selectFileTypeTab("all"))}>
                All Files
              </div>
              <div className={fileTypeTab === "approved" ? styles.activeTab : styles.inactiveTab} onClick={() => dispatch(selectFileTypeTab("approved"))}>
                Approved
              </div>
              <div className={fileTypeTab === "discussion" ? styles.activeTab : styles.inactiveTab} onClick={() => dispatch(selectFileTypeTab("discussion"))}>
                In-Discussion
              </div>
              <div className={`${fileTypeTab === "execution" ? styles.activeTab : styles.inactiveTab} me-0`} onClick={() => dispatch(selectFileTypeTab("execution"))}>
                In-Execution
              </div>
            </div>
          </div>

          <div style={{ width: "100%", height: "75%", display: "flex", justifyContent: "space-between" }}>
            <div className={styles.filesTableContainer} style={detailsVersionTab === "" ? { width: "100%" } : { width: "70%" }}>
              <div className="d-flex justify-content-end mb-2">
                {user === "internal" && (
                  <div className={styles.internalTabContainer}>
                    <div className={internalTab === "internal" ? styles.activeInternalTab : styles.inactiveInternalTab} onClick={() => dispatch(selectInternalTab("internal"))}>
                      Internal
                    </div>
                    <div className={internalTab === "client" ? styles.activeInternalTab : styles.inactiveInternalTab} onClick={() => dispatch(selectInternalTab("client"))}>
                      Client
                    </div>
                  </div>
                )}
              </div>
              {internalTab === "internal" ? (
                fileTypeTab === "all" ? (
                  <FilesTable
                    fileData={
                      id
                        ? fileFolderArr.filter((curElem) => {
                          return curElem.projectId === id;
                        })
                        : fileFolderArr
                    }
                  />
                ) : fileTypeTab === "discussion" ? (
                  <OnlyFilesTable
                    fileData={
                      id
                        ? onlyFilesArr
                          .filter((cur) => {
                            return cur.projectId === id;
                          })
                          .filter((curElem) => {
                            return curElem.isSendForApproval;
                          })
                        : onlyFilesArr
                    }
                  />
                ) : (
                  <OnlyFilesTable
                    fileData={
                      id
                        ? onlyFilesArr.filter((cur) => {
                          return cur.projectId === id;
                        })
                        : onlyFilesArr
                    }
                  />
                )
              ) : (
                <FilesTable fileData={clientFilesArr} />
              )}
            </div>
            <div className={styles.detVerContainer} style={detailsVersionTab === "" ? { width: "0", border: "none" } : { width: "28%" }}>
              <FileDetailsAndVersion />
            </div>
          </div>
        </div>
      </div >
    </>
  ) : (
    <>
      <div className="container-box">
        <FileLanding />
      </div>
    </>
  );
};

export default HomepageWeb;
