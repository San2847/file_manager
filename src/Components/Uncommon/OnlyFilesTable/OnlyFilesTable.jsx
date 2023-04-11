import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import LoadingSekeleton from "../../Common/LoadingSkeleton/LoadingSekeleton";
import styles from "./onlyFilesTable.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { IoMdImage } from "react-icons/io";
import { createDateString, getFiles, getFileStatus, showApprovalOrFeed } from "../../../Services/commonFunctions";
import { RiChatNewLine, RiChatQuoteFill, RiChatQuoteLine } from "react-icons/ri";
import FeedbackCard from "../FeedbackCard/FeedbackCard";
import { Dropdown } from "react-bootstrap";
import { HiEllipsisVertical } from "react-icons/hi2";
import {
  clearFileCheckbox,
  fillFileCheckbox,
  handleDetailsVersionBox,
  saveArrayForApproval,
  saveFileToNewVersion,
  saveNewFileForVersion,
  savePrepareDeleteArr,
  selectAllCheckBoxes,
  selectFileCheckbox,
  selectFileFolderToBeRenamed,
  setFilesGoingFor,
  setModalState,
  setVersionConfirmationReturns,
} from "../../../Redux/slices/filemanagerSlice";
import RenameModal from "../RenameModal/RenameModal";
import uuid from "react-uuid";
import { getReq, postReq, putReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getUserId } from "../../../Services/authService";
import fileDownload from "js-file-download";
import { useParams } from "react-router-dom";

const OnlyFilesTable = ({ fileData }) => {
  const dispatch = useDispatch();
  const { detailsVersionTab, loading, fileTypeTab, versionConfirmationReturns, fileCheckBoxArr } = useSelector((state) => state.filemanager);
  const newVerUploadRef = useRef(null);
  const [addedFilesArr, setAddedFilesArr] = useState([]);

  const { id } = useParams();

  let inlineInactive = {
    pointerEvents: "none",
    color: "#dfdfdf",
  };
  const [openedDrop, setOpenedDrop] = useState("");

  const uploadNewVersion = (outItem) => {
    dispatch(setVersionConfirmationReturns(false));
    dispatch(saveFileToNewVersion({ container: { _id: outItem.folderId }, file: outItem }));
    if (outItem.isSendForExecution) {
      dispatch(setModalState({ modal: "versionConfirmation", state: true }));
    } else {
      newVerUploadRef.current.click();
    }
  };
  const handleNewVersionUpload = async (event) => {
    const { files } = event.target;
    let filesToUpload = new FormData();
    filesToUpload.append("bucketName", `${process.env.REACT_APP_BUCKET_NAME}`);
    filesToUpload.append("files", files[0]);
    const res = await putReq(`${apiLinks.s3api}/api/upload`, filesToUpload);
    if (res && !res.error) {
      const savRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-details`, {
        userId: getUserId(),
        fileDetails: [{ uuId: uuid(), fileName: files[0].name, fileLink: res.data.locations[0], fileType: files[0].type, fileSize: `${Math.round(files[0].size / 1024)} KB`, type: 1 }],
      });
      if (savRes && !savRes.error) {
        // dispatch(saveNewFileForVersion({ container: savRes.data, file: savRes.data.fileDetails[0] }));
        dispatch(
          saveNewFileForVersion({
            fileName: savRes.data.fileDetails[0].fileName,
            fileLink: savRes.data.fileDetails[0].fileLink,
            fileType: savRes.data.fileDetails[0].fileType,
            fileSize: savRes.data.fileDetails[0].fileSize,
            type: 1,
          })
        );
        dispatch(setModalState({ modal: "uploadNewVersion", state: true }));
        dispatch(setVersionConfirmationReturns(false));
      } else {
        console.log(savRes.error);
        dispatch(setVersionConfirmationReturns(false));
      }
    } else {
      console.log(res.error);
      dispatch(setVersionConfirmationReturns(false));
    }
  };

  const toArrayForApproval = async (item) => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-single-file?uuId=${item.uuId}`);
    if (res && !res.error) {
      dispatch(saveArrayForApproval({ container: res.data[0], file: item }));
    } else {
      console.log(res.error);
    }
  };

  const downloadFile = (file) => {
    fileDownload(file.fileLink, `${file.fileName}`);
  };

  const deleteSingleFileOrFolder = async (item) => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-single-file?uuId=${item.uuId}`);
    if (res && !res.error) {
      dispatch(setModalState({ modal: "deleteModal", state: true }));
      dispatch(savePrepareDeleteArr([{ id: res.data._id, fileId: item._id }]));
    } else {
      console.log(res.error);
    }
  };

  const checkboxSelectUnselect = (elem) => {
    let x = addedFilesArr.map((curElem) => {
      return curElem._id;
    });
    if (!x.includes(elem._id)) {
      setAddedFilesArr((prev) => {
        return [...prev, elem];
      });
    } else {
      let y = addedFilesArr.filter((curElem) => {
        return curElem._id !== elem._id;
      });
      setAddedFilesArr([...y]);
    }
  };

  const approveFiles = async (item) => {
    const appRes = await postReq(`${apiLinks.pmt}/api/file-manager/edit-file?id=${item.folderId}&fileId=${item._id}`, { status: 2 });
    if (appRes && !appRes.error) {
      getFiles(0, id);
    } else {
      console.log(appRes.error);
    }
  };

  const getFileFeedback = async (item) => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-single-file?uuId=${item.uuId}`);
    if (res && !res.error) {
      const feedRes = await getReq(`${apiLinks.pmt}/api/file-manager/get-file-feedback?id=${res.data._id}&fileId=${item._id}`);
      if (feedRes && !feedRes.error) {
        getFiles(2, id);
      } else {
        console.log(feedRes.error);
      }
    } else {
      console.log(res.error);
    }
  };
  const readFeedback = async (item) => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-single-file?uuId=${item.uuId}`);
    if (res && !res.error) {
      const readRes = await postReq(`${apiLinks.pmt}/api/file-manager/read-feedback?id=${res.data._id}&fileId=${item._id}`);
      if (readRes && !readRes.error) {
        // console.log(readRes);
      } else {
        console.log(readRes.error);
      }
    } else {
      console.log(res.error);
    }
  };

  const [openedFeedback, setOpenedFeedback] = useState("");
  const openFeedbacks = (item) => {
    if (openedFeedback._id === item._id) {
      setOpenedFeedback("");
    } else {
      setOpenedFeedback(item);
    }
  };
  const [openedGiveFeed, setOpenedGiveFeed] = useState("");
  const openGiveFeed = (event, obj) => {
    event.stopPropagation();
    if (openedGiveFeed.file && openedGiveFeed.file._id === obj.file._id) {
      setOpenedGiveFeed("");
    } else {
      setOpenedGiveFeed(obj);
    }
  };

  const [allSelectCheckboxState, setAllSelectCheckboxState] = useState(false);
  const selectAllFiles = () => {
    let allFiles = fileData;
    if (fileCheckBoxArr.length === allFiles.length) {
      dispatch(clearFileCheckbox());
    } else {
      let x = fileData.flatMap((curElem) => {
        return { container: { _id: curElem.folderId }, fileOrFold: curElem, type: "outside" };
      });
      dispatch(selectAllCheckBoxes(x));
    }
  };

  useEffect(() => {
    let allFiles = fileData;
    if (allFiles.length === fileCheckBoxArr.length) {
      setAllSelectCheckboxState(true);
    } else {
      setAllSelectCheckboxState(false);
    }
  }, [fileCheckBoxArr, fileData]);

  useEffect(() => {
    if (addedFilesArr) {
      let x = addedFilesArr.map((curElem) => {
        return { container: { _id: curElem.folderId }, fileOrFold: curElem, type: "inside" };
      });
      dispatch(fillFileCheckbox(x));
    }
  }, [addedFilesArr]);

  useEffect(() => {
    let x = fileCheckBoxArr.map((curElem) => {
      return curElem.fileOrFold;
    });
  }, [fileCheckBoxArr]);

  useEffect(() => {
    setAddedFilesArr([]);
  }, [fileTypeTab]);

  useEffect(() => {
    if (versionConfirmationReturns === true) {
      newVerUploadRef.current.click();
    }
  }, [versionConfirmationReturns]);
  return (
    <>
      <RenameModal />
      <input type="file" onChange={handleNewVersionUpload} className="d-none" ref={newVerUploadRef} />
      <div className="d-flex mb-2 px-2">
        <div style={{ width: detailsVersionTab === "" ? "25%" : "50%", fontSize: "12px", color: "#333333", fontWeight: "500", paddingLeft: "0.5rem", display: "flex", alignItems: "center" }}>
          <div className={allSelectCheckboxState ? styles.activeCheckbox : styles.customCheckbox} style={{ marginRight: "1.5rem" }} onClick={selectAllFiles}>
            <BsCheck />
          </div>
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
                <>
                  <div className={styles.eachCard}>
                    <div
                      style={{ width: detailsVersionTab === "" ? "25%" : "50%", fontSize: "12px", color: "#333333", fontWeight: "500", paddingLeft: "0.5rem", display: "flex", alignItems: "center" }}
                    >
                      <div
                        className={
                          addedFilesArr
                            .map((cure) => {
                              return cure._id;
                            })
                            .includes(curElem._id)
                            ? styles.activeCheckbox
                            : styles.customCheckbox
                        }
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
                    <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "500" }}>{getFileStatus(curElem)}</div>
                    {detailsVersionTab === "" && (
                      <div style={{ width: "10%", fontSize: "12px", color: "#333333", fontWeight: "500", display: "flex", justifyContent: "center" }}>
                        {showApprovalOrFeed(curElem) !== "none" ? (
                          showApprovalOrFeed(curElem) === "approval" ? (
                            <div className="d-flex">
                              <div
                                className={styles.approveTick}
                                title="Approve"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  approveFiles(curElem);
                                }}
                              >
                                <BsCheck />
                              </div>
                              <div className={styles.addFeed} title="Give Feedback" onClick={(event) => openGiveFeed(event, curElem)}>
                                <RiChatNewLine />
                              </div>
                            </div>
                          ) : openedFeedback && openedFeedback._id === curElem._id ? (
                            <RiChatQuoteFill fontSize={18} className={styles.commentButton} onClick={(event) => openFeedbacks(event, curElem)} />
                          ) : (
                            <RiChatQuoteLine
                              fontSize={18}
                              className={styles.commentButton}
                              onClick={(event) => {
                                openFeedbacks(event, curElem);
                                getFileFeedback(curElem);
                                readFeedback(curElem);
                              }}
                            />
                          )
                        ) : (
                          "-"
                        )}
                      </div>
                    )}
                    <div style={{ width: detailsVersionTab === "" ? "5%" : "10%" }}>
                      <Dropdown show={openedDrop === curElem._id}>
                        <Dropdown.Toggle
                          as="button"
                          className="no-drop-arrow p-0"
                          style={{ border: "none", backgroundColor: "#ffffff00", display: "flex", justifyContent: "center", alignItems: "center" }}
                          onBlur={() => {
                            setTimeout(() => {
                              setOpenedDrop("");
                            }, 250);
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (openedDrop) {
                              setOpenedDrop("");
                            } else {
                              setOpenedDrop(curElem._id);
                            }
                          }}
                        >
                          <HiEllipsisVertical />
                        </Dropdown.Toggle>
                        <Dropdown.Menu rootCloseEvent={() => setOpenedDrop("")}>
                          <Dropdown.Item
                            style={
                              getFileStatus(curElem) === "Approved" || getFileStatus(curElem) === "In-Execution" || getFileStatus(curElem) === "Approval Pending"
                                ? { fontSize: "12px", ...inlineInactive }
                                : { fontSize: "12px" }
                            }
                            onClick={() => {
                              dispatch(selectFileFolderToBeRenamed({ container: curElem, fileOrFold: curElem, type: "inside", tab: "onlyFiles" }));
                              dispatch(setModalState({ modal: "renameModal", state: true }));
                            }}
                          >
                            Rename
                          </Dropdown.Item>
                          <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => dispatch(handleDetailsVersionBox({ item: { container: curElem, file: curElem }, tab: "version" }))}>
                            Version History
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ fontSize: "12px" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              uploadNewVersion(curElem);
                            }}
                          >
                            Upload new version
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={
                              getFileStatus(curElem) === "Approved" || getFileStatus(curElem) === "In-Execution" || getFileStatus(curElem) === "Approval Pending"
                                ? { fontSize: "12px", ...inlineInactive }
                                : { fontSize: "12px" }
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                              dispatch(setFilesGoingFor("approval"));
                              toArrayForApproval(curElem);
                              dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                            }}
                          >
                            Send for Approval
                          </Dropdown.Item>
                          <Dropdown.Item
                            style={{ fontSize: "12px" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              dispatch(setFilesGoingFor("execution"));
                              toArrayForApproval(curElem);
                              // dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                              if (getFileStatus(curElem) !== "Approved") {
                                dispatch(setModalState({ modal: "selfApprovalConfirmation", state: true }));
                              } else {
                                dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                              }
                            }}
                          >
                            Send for Execution
                          </Dropdown.Item>
                          <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => dispatch(handleDetailsVersionBox({ item: { container: curElem, file: curElem }, tab: "details" }))}>
                            File Details
                          </Dropdown.Item>
                          <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => downloadFile(curElem)}>
                            Download
                          </Dropdown.Item>
                          <Dropdown.Item style={{ fontSize: "12px" }}>Share</Dropdown.Item>
                          <Dropdown.Item
                            style={
                              getFileStatus(curElem) === "Approved" || getFileStatus(curElem) === "In-Execution" || getFileStatus(curElem) === "Approval Pending"
                                ? { fontSize: "12px", ...inlineInactive }
                                : { fontSize: "12px", color: "red" }
                            }
                            onClick={() => deleteSingleFileOrFolder(curElem)}
                          >
                            Delete File
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className={styles.feedbackContainer} style={{ height: openedFeedback._id === curElem._id ? "10rem" : "0" }}>
                    <div style={{ height: "fit-content", width: "100%", padding: "0.5rem" }}>
                      {curElem.feedBack &&
                        curElem.feedBack.map((cur, index) => {
                          return <FeedbackCard feedData={cur} currentVer={index === 0} name={curElem.fileName} />;
                        })}
                    </div>
                  </div>
                </>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default OnlyFilesTable;
