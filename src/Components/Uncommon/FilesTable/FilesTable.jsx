import React, { useEffect, useRef, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { IoMdImage } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fakeFiles } from "../../../constants/fakeJson";
import styles from "./filesTable.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { RiChatNewLine, RiChatQuoteFill, RiChatQuoteLine } from "react-icons/ri";
import { HiEllipsisVertical } from "react-icons/hi2";
import {
  clearFileCheckbox,
  handleDetailsVersionBox,
  saveArrayForApproval,
  saveFilesToBeShared,
  saveFileToNewVersion,
  saveFolderToBeDeleted,
  saveNewFileForVersion,
  savePrepareDeleteArr,
  selectAllCheckBoxes,
  selectFileCheckbox,
  selectFileFolderToBeRenamed,
  setFilesGoingFor,
  setModalState,
  setVersionConfirmationReturns,
} from "../../../Redux/slices/filemanagerSlice";
import FeedbackCard from "../FeedbackCard/FeedbackCard";
import { Dropdown } from "react-bootstrap";
import { AiOutlineArrowUp } from "react-icons/ai";
import LoadingSekeleton from "../../Common/LoadingSkeleton/LoadingSekeleton";
import RenameModal from "../RenameModal/RenameModal";
import { getReq, postReq, putReq } from "../../../Services/api";
import { apiLinks } from "../../../constants/constants";
import { getFiles, getFileStatus, saveFileChangesAsVersion, scrollFileContainerToTop } from "../../../Services/commonFunctions";
import DeleteFolderModal from "./DeleteFolderModal/DeleteFolderModal";
import { getUserId } from "../../../Services/authService";
import uuid from "react-uuid";
import fileDownload from "js-file-download";

const FilesTable = ({ fileData }) => {
  const dispatch = useDispatch();
  const { fileCheckBoxArr, detailsVersionTab, loading, versionConfirmationReturns, profileData } = useSelector((state) => state.filemanager);

  const newVerUploadRef = useRef(null);

  const [addedFilesArr, setAddedFilesArr] = useState([]);

  const [openedFolder, setOpenedFolder] = useState([]);

  const [spaceName, setSpaceName] = useState("");
  const [drawType, setDrawType] = useState("");
  const [spaceNameTest, setSpaceNameTest] = useState("");
  const [drawTypeTest, setDrawTypeTest] = useState("");
  const [showInput, setShowInput] = useState("");

  let inlineInactive = {
    pointerEvents: "none",
    color: "#dfdfdf",
  };

  const spaceDrawInput = (event) => {
    const { name, value } = event.target;
    if (name === "spaceName") {
      setSpaceName(value);
    } else if (name === "drawType") {
      setDrawType(value);
    }
  };
  const spaceDrawSubmit = async (elem, event, inElem, contObj) => {
    if (spaceNameTest !== spaceName || drawTypeTest !== drawType) {
      const { name } = event.target;
      let obj = {};
      if (name === "spaceName") {
        obj["spaceName"] = spaceName;
      } else if (name === "drawType") {
        obj["drawingType"] = drawType;
      }
      const res = await postReq(`${apiLinks.pmt}/api/file-manager/edit-file?id=${elem._id}&fileId=${inElem ? inElem._id : elem.fileDetails[0]._id}`, obj);
      if (res && !res.error) {
        saveFileChangesAsVersion(contObj);
        setShowInput("");
        setDrawType("");
        setSpaceName("");
        getFiles(1);
      } else {
        console.log(res.error);
      }
    }
  };

  const openFolderOrSelectFile = (elem) => {
    if (elem.folderName) {
      setOpenedFolder((prev) => {
        return [...prev, `folder-${elem._id}`];
      });
    } else {
      dispatch(selectFileCheckbox({ container: elem, fileOrFold: elem.fileDetails[0], type: "outside" }));
    }
    if (openedFolder.includes(`folder-${elem._id}`)) {
      let x = openedFolder.filter((curElem) => {
        return curElem !== `folder-${elem._id}`;
      });
      setOpenedFolder(x);
    }
  };

  const [openedInfo, setOpenedInfo] = useState("");
  const openInfo = (event, obj) => {
    event.stopPropagation();
    if (openedInfo.file && openedInfo.file._id === obj.file._id) {
      setOpenedInfo("");
    } else {
      setOpenedInfo(obj);
    }
  };

  const [openedDrop, setOpenedDrop] = useState(false);

  const dArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const makeDateString = (dString) => {
    const date = new Date(dString);
    const day = date.getDate();
    const month = dArr[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const deleteSingleFileOrFolder = async (item) => {
    dispatch(setModalState({ modal: "deleteModal", state: true }));
    dispatch(savePrepareDeleteArr([{ id: item.container._id, fileId: item.file._id }]));
  };
  const deleteOnlyFolder = async (item) => {
    dispatch(setModalState({ modal: "deleteFolderModal", state: true }));
    dispatch(saveFolderToBeDeleted(item._id));
  };

  const uploadNewVersion = (item, outItem) => {
    dispatch(saveFileToNewVersion({ container: item, file: outItem }));
    dispatch(setVersionConfirmationReturns(false));
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
      dispatch(saveNewFileForVersion({ fileName: files[0].name, fileLink: res.data.locations[0], fileType: files[0].type, fileSize: `${Math.round(files[0].size / 1024)}KB`, type: 1 }));
      dispatch(setModalState({ modal: "uploadNewVersion", state: true }));
      dispatch(setVersionConfirmationReturns(false));
    } else {
      console.log(res.error);
      dispatch(setVersionConfirmationReturns(false));
    }
  };

  const getFileInfo = async () => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-file-feedback?id=${openedInfo.container._id}&fileId=${openedInfo.file._id}`);
    if (res && !res.error) {
      // console.log(res.data);
    } else {
      console.log(res.error);
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

  const [feedbackText, setFeedbackText] = useState("");
  const [fileFeedArr, setFileFeedArr] = useState([]);
  const inputFeedback = (event) => {
    setFeedbackText(event.target.value);
  };
  const submitFeedback = async () => {
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/send-feedback?id=${openedGiveFeed.container._id}&fileId=${openedGiveFeed.file._id}`, {
      sendBy: getUserId(),
      message: `${feedbackText}~-+-~${profileData.fullName}`,
    });
    if (res && !res.error) {
      getFiles(1);
      saveFileChangesAsVersion({ container: openedGiveFeed.container, file: openedGiveFeed.file, text: `A feedback has been added by ${profileData.fullName}~-+-~${feedbackText}` });
      setFileFeedArr([...res.data.fileDetails[0].feedBack]);
      setOpenedGiveFeed("");
      setFeedbackText("");
      scrollFileContainerToTop();
    } else {
      console.log(res.error);
    }
  };
  const getFileFeedback = async (fileObj) => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-file-feedback?id=${fileObj.container._id}&fileId=${fileObj.file._id}`);
    if (res && !res.error) {
      setFileFeedArr([...res.data]);
    } else {
      console.log(res.error);
    }
  };
  const readFeedback = async (fileObj) => {
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/read-feedback?id=${fileObj.container._id}&fileId=${fileObj.file._id}`);
    if (res && !res.error) {
      // console.log(res);
    } else {
      console.log(res.error);
    }
  };

  const showApprovalOrFeed = (obj) => {
    // let unread = obj.file
    //   ? obj.file.feedBack.filter((curElem) => {
    //       return curElem.isRead === false;
    //     })
    //   : [];
    if (obj.file) {
      if (obj.file.feedBack.length > 0) {
        if (obj.file.status === 2) {
          return "feed";
        } else {
          if (obj.file && obj.file.approvalRequestTo === getUserId()) {
            if (obj.file.feedBack.length > 0) {
              return "feed";
            } else {
              if (obj.file.isSendForApproval === true) {
                if (obj.file.isSendForExecution === true) {
                  return "approval";
                } else {
                  return "approval";
                }
              } else {
                return "feed";
              }
            }
          } else {
            return "feed";
          }
        }
      } else {
        if (obj.file.status === 2) {
          return "none";
        } else {
          if (obj.file && obj.file.approvalRequestTo === getUserId()) {
            if (obj.file.isSendForApproval === true) {
              if (obj.file.isSendForExecution === true) {
                return "none";
              } else {
                return "approval";
              }
            }
          } else {
            return "none";
          }
        }
      }
    } else {
      return "none";
    }
  };

  const approveFiles = async (fileObj) => {
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/edit-file?id=${fileObj.container._id}&fileId=${fileObj.file._id}`, { status: 2 });
    if (res && !res.error) {
      saveFileChangesAsVersion({ container: fileObj.container, file: fileObj.file, text: `has been approved by ${profileData.fullName}` });
      getFiles(1);
    } else {
      console.log(res.error);
    }
  };

  const downloadFile = (file) => {
    fileDownload(file.fileLink, `${file.fileName}`);
  };

  const [uploaderData, setUploaderData] = useState([]);
  const getUploaderData = async (userIdArr) => {
    const res = await postReq(`${apiLinks.pmt}/api/projects/get-profiles-by-userids`, { userIds: userIdArr });
    if (res && !res.error) {
      setUploaderData([...res.data]);
    } else {
      console.log(res.error);
    }
  };

  const [requestToId, setRequestToId] = useState([]);
  const getRequestToIds = async (idArr) => {
    let defArr = idArr.filter((curElem) => {
      return curElem !== undefined;
    });
    const res = await postReq(`${apiLinks.pmt}/api/projects/get-profiles-by-userids`, { userIds: defArr });
    if (res && !res.error) {
      setRequestToId([...res.data]);
    } else {
      console.log(res.error);
    }
  };

  const [allSelectCheckboxState, setAllSelectCheckboxState] = useState(false);
  const selectAllFiles = () => {
    let allFiles = fileData
      .map((curEl) => {
        return curEl.fileDetails;
      })
      .flat();
    if (fileCheckBoxArr.length === allFiles.length) {
      dispatch(clearFileCheckbox());
    } else {
      let x = fileData.flatMap((curElem) => {
        if (!curElem.folderName) {
          return { container: curElem, fileOrFold: curElem.fileDetails[0], type: "outside" };
        } else {
          return curElem.fileDetails.map((cur) => {
            return { container: curElem, fileOrFold: cur, type: "inside" };
          });
        }
      });
      dispatch(selectAllCheckBoxes(x));
    }
  };

  useEffect(() => {
    let allFiles = fileData
      .map((curEl) => {
        return curEl.fileDetails;
      })
      .flat();
    if (allFiles.length === fileCheckBoxArr.length) {
      setAllSelectCheckboxState(true);
    } else {
      setAllSelectCheckboxState(false);
    }
  }, [fileCheckBoxArr, fileData]);

  useEffect(() => {
    if (fileData) {
      let x = fileData.map((curElem) => {
        return curElem.userId;
      });
      getUploaderData(x);

      let y = fileData.map((curElem) => {
        if (curElem.fileDetails[0] && !curElem.folderName && curElem.fileDetails[0].executionRequestTo !== undefined && curElem.fileDetails[0].executionRequestTo !== "") {
          return curElem.fileDetails[0].executionRequestTo;
        } else if (curElem.fileDetails[0] && !curElem.folderName && curElem.fileDetails[0].approvalRequestTo !== undefined && curElem.fileDetails[0].approvalRequestTo !== "") {
          return curElem.fileDetails[0].approvalRequestTo;
        }
      });
      getRequestToIds(y);
    }
  }, [fileData]);

  useEffect(() => {
    if (fileCheckBoxArr) {
      let x = fileCheckBoxArr.map((curElem) => {
        return curElem.fileOrFold._id;
      });
      setAddedFilesArr([...x]);
    }
  }, [fileCheckBoxArr]);

  useEffect(() => {
    let x = fileCheckBoxArr.map((curElem) => {
      return {
        id: curElem.container._id,
        fileId: curElem.fileOrFold._id,
      };
    });
    dispatch(savePrepareDeleteArr([...x]));
  }, [fileCheckBoxArr]);

  useEffect(() => {
    if (versionConfirmationReturns) {
      newVerUploadRef.current.click();
    }
  }, [versionConfirmationReturns]);

  useEffect(() => {
    if (openedInfo !== "") {
      getFileInfo();
    }
  }, [openedInfo]);

  useEffect(() => {
    if (fileCheckBoxArr) {
      let x = JSON.parse(JSON.stringify(fileCheckBoxArr));
      x.forEach((curElem) => {
        let b = curElem.fileOrFold;
        delete curElem["fileOrFold"];
        curElem["file"] = b;
      });

      dispatch(saveFilesToBeShared([...x]));
    }
  }, [fileCheckBoxArr]);

  return (
    <>
      <RenameModal />
      <DeleteFolderModal />
      <input type="file" onChange={handleNewVersionUpload} className="d-none" ref={newVerUploadRef} />
      <div className="d-flex mb-2 px-2 align-items-center">
        <div className={allSelectCheckboxState ? styles.activeCheckbox : styles.customCheckbox} onClick={selectAllFiles}>
          <BsCheck />
        </div>
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
        {detailsVersionTab === "" && <div style={{ width: "10%", fontSize: "12px", color: "#333333", fontWeight: "500", display: "flex", justifyContent: "center" }}>Action</div>}
        <div style={{ width: detailsVersionTab === "" ? "5%" : "10%" }}></div>
      </div>

      <div className="d-flex flex-column" id="file-container-div" style={{ height: "80%", overflowY: "scroll" }}>
        <div style={{ height: "fit-content" }}>
          {loading ? (
            <LoadingSekeleton />
          ) : fileData ? (
            <>
              {fileData.map((curElem, index) => {
                let unreadFeeds =
                  curElem?.fileDetails &&
                  curElem?.fileDetails[0]?.feedBack.filter((curF) => {
                    return curF.isRead === false;
                  });

                let curInitial = uploaderData[index]?.data?.data[0]?.fullName === "x" ? "-" : uploaderData[index]?.data?.data[0]?.fullName.split("")[0];

                return (
                  <>
                    <div style={openedDrop === curElem._id ? { backgroundColor: "#f2f2f2", position: "relative", zIndex: "1000" } : { backgroundColor: "#f7f7f7" }}>
                      <div
                        className={curElem.folderName ? (openedFolder !== `folder-${curElem._id}` ? styles.folderCardNotOpened : styles.folderCard) : styles.eachCard}
                        onClick={() => openFolderOrSelectFile(curElem)}
                      >
                        <div style={{ width: detailsVersionTab === "" ? "25%" : "50%", fontSize: "14px", color: "#333333", fontWeight: "500", display: "flex", alignItems: "center" }}>
                          {!curElem.folderName ? (
                            <div
                              className={addedFilesArr.length > 0 && addedFilesArr.includes(curElem.fileDetails[0]._id) ? styles.activeCheckbox : styles.customCheckbox}
                              onClick={(event) => {
                                event.stopPropagation();
                                dispatch(selectFileCheckbox({ container: curElem, fileOrFold: curElem.fileDetails[0], type: "outside" }));
                              }}
                            >
                              <BsCheck />
                            </div>
                          ) : (
                            <div className={styles.noFileBox}></div>
                          )}
                          <div className="d-flex align-items-center me-1">
                            {curElem.folderName ? (
                              <FaFolder color="#F2B007" fontSize={18} />
                            ) : curElem.fileDetails[0] && curElem.fileDetails[0].fileType.split("/")[0] === "image" ? (
                              <IoMdImage color="#26AD74" fontSize={20} />
                            ) : (
                              <img src={pdfIcon} alt="" />
                            )}
                          </div>
                          <div
                            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center" }}
                            onClick={(event) => {
                              if (!curElem.folderName) {
                                event.stopPropagation();
                              }
                            }}
                          >
                            {curElem.folderName ? (
                              curElem.folderName ? (
                                curElem.folderName
                              ) : (
                                "Untitled"
                              )
                            ) : (
                              <a
                                title={curElem.fileDetails[0] && curElem.fileDetails[0].fileName}
                                className={styles.fileLinkName}
                                href={curElem.fileDetails[0] && curElem.fileDetails[0].fileLink}
                                target="_blank"
                              >
                                {curElem.fileDetails[0] && curElem.fileDetails[0].fileName}
                              </a>
                            )}
                            {uploaderData[index]?.fullName !== "x" && (
                              <span className={styles.senderInitial} title={uploaderData[index]?.data?.data[0]?.fullName}>
                                {curInitial}
                              </span>
                            )}
                          </div>
                        </div>
                        {detailsVersionTab === "" && (
                          <>
                            <div style={{ width: "15%", fontSize: "14px", color: "#333333", fontWeight: "400", paddingRight: "0.25rem" }}>
                              {!curElem.folderName &&
                                (showInput === curElem._id ? (
                                  <input
                                    autoFocus
                                    type="text"
                                    className={styles.eachCardInput}
                                    name="spaceName"
                                    value={spaceName}
                                    onChange={spaceDrawInput}
                                    onBlur={(event) => spaceDrawSubmit(curElem, event, undefined, { container: curElem, file: curElem.fileDetails[0], text: "Space Name Updated" })}
                                    onClick={(event) => event.stopPropagation()}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") {
                                        spaceDrawSubmit(curElem, event, undefined, { container: curElem, file: curElem.fileDetails[0], text: "Space Name Updated" });
                                      }
                                    }}
                                  />
                                ) : (
                                  <div
                                    className={styles.spaceDrawDiv}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSpaceName(curElem.fileDetails[0].spaceName ? curElem.fileDetails[0].spaceName : "-");
                                      setSpaceNameTest(curElem.fileDetails[0].spaceName ? curElem.fileDetails[0].spaceName : "-");
                                      setDrawType(curElem.fileDetails[0].drawingType ? curElem.fileDetails[0].drawingType : "-");
                                      setDrawTypeTest(curElem.fileDetails[0].drawingType ? curElem.fileDetails[0].drawingType : "-");
                                      setShowInput(curElem._id);
                                    }}
                                  >
                                    {curElem.fileDetails[0] && curElem.fileDetails[0].spaceName ? curElem.fileDetails[0].spaceName : "-"}
                                  </div>
                                ))}
                            </div>
                            <div style={{ width: "15%", fontSize: "14px", color: "#333333", fontWeight: "400", paddingRight: "0.25rem" }}>
                              {!curElem.folderName &&
                                (showInput === curElem._id ? (
                                  <input
                                    type="text"
                                    className={styles.eachCardInput}
                                    name="drawType"
                                    value={drawType}
                                    onChange={spaceDrawInput}
                                    onBlur={(event) => spaceDrawSubmit(curElem, event, undefined, { container: curElem, file: curElem.fileDetails[0], text: "Drawing Type Updated" })}
                                    onClick={(event) => event.stopPropagation()}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") {
                                        spaceDrawSubmit(curElem, event, undefined, { container: curElem, file: curElem.fileDetails[0], text: "Drawing Type Updated" });
                                      }
                                    }}
                                  />
                                ) : (
                                  <div
                                    className={styles.spaceDrawDiv}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSpaceName(curElem.fileDetails[0].spaceName ? curElem.fileDetails[0].spaceName : "-");
                                      setSpaceNameTest(curElem.fileDetails[0].spaceName ? curElem.fileDetails[0].spaceName : "-");
                                      setDrawType(curElem.fileDetails[0].drawingType ? curElem.fileDetails[0].drawingType : "-");
                                      setDrawTypeTest(curElem.fileDetails[0].drawingType ? curElem.fileDetails[0].drawingType : "-");
                                      setShowInput(curElem._id);
                                    }}
                                  >
                                    {curElem.fileDetails[0] && curElem.fileDetails[0].drawingType ? curElem.fileDetails[0].drawingType : "-"}
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                        <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "400" }}>
                          {curElem.folderName
                            ? makeDateString(curElem.updatedAt)
                            : curElem.fileDetails[0] && curElem.fileDetails[0].updateTime
                            ? makeDateString(curElem.fileDetails[0].updateTime)
                            : "-"}
                        </div>
                        <div
                          style={{
                            width: detailsVersionTab === "" ? "15%" : "20%",
                            fontSize: "12px",
                            color: "#333333",
                            fontWeight: "400",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {!curElem.folderName && curElem.fileDetails[0] && (curElem.fileDetails[0].approvalRequestName || curElem.fileDetails[0].approvalRequestName) && (
                            <span
                              className={`${styles.senderInitial} me-1`}
                              title={
                                curElem.fileDetails[0].executionRequestName
                                  ? curElem.fileDetails[0].executionRequestName
                                  : curElem.fileDetails[0].approvalRequestName
                                  ? curElem.fileDetails[0].approvalRequestName
                                  : ""
                              }
                            >
                              {curElem.fileDetails[0].executionRequestName
                                ? curElem.fileDetails[0].executionRequestName.split("")[0]
                                : curElem.fileDetails[0].approvalRequestName
                                ? curElem.fileDetails[0].approvalRequestName.split("")[0]
                                : ""}
                            </span>
                          )}
                          {curElem.folderName ? "" : curElem.fileDetails[0] && getFileStatus(curElem.fileDetails[0])}
                          {/* <span className={styles.senderInitial} title={uploaderData[index]?.data?.data[0]?.fullName}>
                            {requestInitial[0].data.data[0].fullName}
                          </span> */}
                        </div>

                        {/* this part is for approval and feedback buttons for normal files */}
                        {detailsVersionTab === "" && (
                          <div style={{ width: "10%", fontSize: "18px", fontWeight: "400", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
                            {!curElem.folderName && showApprovalOrFeed({ container: curElem, file: curElem.fileDetails[0] ? curElem.fileDetails[0] : undefined }) !== "none" ? (
                              showApprovalOrFeed({ container: curElem, file: curElem.fileDetails[0] ? curElem.fileDetails[0] : undefined }) === "approval" ? (
                                <div className="d-flex">
                                  <div
                                    className={styles.approveTick}
                                    title="Approve"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      approveFiles({ container: curElem, file: curElem.fileDetails[0] ? curElem.fileDetails[0] : undefined });
                                    }}
                                  >
                                    <BsCheck />
                                  </div>
                                  <div className={styles.addFeed} title="Give Feedback" onClick={(event) => openGiveFeed(event, { container: curElem, file: curElem.fileDetails[0] })}>
                                    <RiChatNewLine />
                                  </div>
                                </div>
                              ) : openedInfo?.file && openedInfo?.file?._id === curElem?.fileDetails[0]?._id ? (
                                <RiChatQuoteFill className={styles.commentButton} onClick={(event) => openInfo(event, { container: curElem, file: curElem.fileDetails[0] })} />
                              ) : (
                                <RiChatQuoteLine
                                  className={styles.commentButton}
                                  onClick={(event) => {
                                    openInfo(event, { container: curElem, file: curElem.fileDetails[0] });
                                    getFileFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                    readFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                  }}
                                />
                              )
                            ) : (
                              "-"
                            )}
                            {unreadFeeds && unreadFeeds?.length > 0 && !curElem.folderName && (
                              <div
                                style={{
                                  fontSize: "8px",
                                  backgroundColor: "#DD2E44",
                                  color: "#ffffff",
                                  width: "0.8rem",
                                  height: "0.8rem",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "50%",
                                  marginLeft: "0.25rem",
                                }}
                              >
                                {unreadFeeds && unreadFeeds?.length}
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ width: detailsVersionTab === "" ? "5%" : "10%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
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
                                  !curElem.folderName &&
                                  (getFileStatus(curElem.fileDetails[0]) === "Approved" ||
                                    getFileStatus(curElem.fileDetails[0]) === "In-Execution" ||
                                    getFileStatus(curElem.fileDetails[0]) === "Approval Pending")
                                    ? { fontSize: "12px", ...inlineInactive }
                                    : { fontSize: "12px" }
                                }
                                onClick={(event) => {
                                  event.stopPropagation();
                                  if (curElem.folderName) {
                                    dispatch(selectFileFolderToBeRenamed({ container: curElem, fileOrFold: curElem, type: "folder" }));
                                  } else {
                                    dispatch(selectFileFolderToBeRenamed({ container: curElem, fileOrFold: curElem.fileDetails[0], type: "outside" }));
                                  }
                                  dispatch(setModalState({ modal: "renameModal", state: true }));
                                }}
                              >
                                Rename
                              </Dropdown.Item>
                              {!curElem.folderName && (
                                <>
                                  <Dropdown.Item
                                    style={{ fontSize: "12px" }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      dispatch(handleDetailsVersionBox({ item: { container: curElem, file: curElem.fileDetails[0] }, tab: "version" }));
                                    }}
                                  >
                                    Version History
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    style={{ fontSize: "12px" }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      uploadNewVersion(curElem, curElem.fileDetails[0]);
                                    }}
                                  >
                                    Upload new version
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    style={{ fontSize: "12px" }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      dispatch(handleDetailsVersionBox({ item: { container: curElem, file: curElem.fileDetails[0] }, tab: "details" }));
                                    }}
                                  >
                                    File Details
                                  </Dropdown.Item>
                                </>
                              )}
                              {!curElem.folderName && (
                                <>
                                  <Dropdown.Item
                                    style={
                                      !curElem.folderName &&
                                      (getFileStatus(curElem.fileDetails[0]) === "Approved" ||
                                        getFileStatus(curElem.fileDetails[0]) === "In-Execution" ||
                                        getFileStatus(curElem.fileDetails[0]) === "Approval Pending")
                                        ? { fontSize: "12px", ...inlineInactive }
                                        : { fontSize: "12px" }
                                    }
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      dispatch(setFilesGoingFor("approval"));
                                      dispatch(saveArrayForApproval({ container: curElem, file: curElem.fileDetails[0] }));
                                      dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                                    }}
                                  >
                                    Send for Approval
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    // style={
                                    //   !curElem.folderName && (getFileStatus(curElem.fileDetails[0]) === "In-Execution" || getFileStatus(curElem.fileDetails[0]) === "Approval Pending")
                                    //     ? { fontSize: "12px", ...inlineInactive }
                                    //     : { fontSize: "12px" }
                                    // }
                                    style={{ fontSize: "12px" }}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      dispatch(setFilesGoingFor("execution"));
                                      dispatch(saveArrayForApproval({ container: curElem, file: curElem.fileDetails[0] }));
                                      // if (localStorage.getItem("position") === "admin") {
                                      if (true) {
                                        dispatch(setModalState({ modal: "selfApprovalConfirmation", state: true }));
                                      } else {
                                        dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                                      }
                                    }}
                                  >
                                    Send for Execution
                                  </Dropdown.Item>
                                  <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => downloadFile(curElem.fileDetails[0])}>
                                    Download
                                  </Dropdown.Item>
                                </>
                              )}
                              {!curElem.folderName && (
                                <Dropdown.Item
                                  style={{ fontSize: "12px" }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch(saveFilesToBeShared([{ container: curElem, file: curElem.fileDetails[0] }]));
                                    dispatch(setModalState({ modal: "shareModal", state: true }));
                                  }}
                                >
                                  Share
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item
                                style={
                                  !curElem.folderName
                                    ? getFileStatus(curElem.fileDetails[0]) === "Approved" ||
                                      getFileStatus(curElem.fileDetails[0]) === "In-Execution" ||
                                      getFileStatus(curElem.fileDetails[0]) === "Approval Pending"
                                      ? { fontSize: "12px", ...inlineInactive }
                                      : { fontSize: "12px", color: "red" }
                                    : curElem.fileDetails.some((each) => {
                                        return getFileStatus(each) !== "-";
                                      })
                                    ? { fontSize: "12px", ...inlineInactive }
                                    : { fontSize: "12px", color: "red" }
                                }
                                onClick={(event) => {
                                  event.stopPropagation();
                                  if (curElem.folderName) {
                                    deleteOnlyFolder(curElem);
                                  } else {
                                    deleteSingleFileOrFolder({ container: curElem, file: curElem.fileDetails[0] });
                                  }
                                }}
                              >
                                Delete {curElem.folderName ? "Folder" : "File"}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      {!curElem.folderName && (
                        <div className={styles.feedbackBox} style={openedInfo.file && openedInfo.file._id === curElem.fileDetails[0]._id ? { height: "fit-content" } : { height: "0" }}>
                          <div className={styles.feedbackContainer}>
                            {fileFeedArr &&
                              fileFeedArr.map((eachFeed, index) => {
                                return (
                                  <FeedbackCard
                                    feedData={eachFeed}
                                    currentVer={index === 0}
                                    name={openedInfo.file ? openedInfo.file.fileName : ""}
                                    containerAndFile={{ container: curElem, file: curElem.fileDetails[0] }}
                                    uploadNewVersionFunc={uploadNewVersion}
                                    profileData={profileData}
                                  />
                                );
                              })}
                          </div>
                        </div>
                      )}
                      {!curElem.folderName && (
                        <div className={styles.feedbackBox} style={openedGiveFeed.file && openedGiveFeed.file._id === curElem.fileDetails[0]._id ? { height: "fit-content" } : { height: "0" }}>
                          <div className={styles.feedbackContainer}>
                            <textarea name="feedbackText" rows="5" value={feedbackText} onChange={inputFeedback} className={styles.feedbackInput}></textarea>
                            <div className="d-flex justify-content-end">
                              <button className={styles.submitFeed} onClick={submitFeedback}>
                                Submit Feedback
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {curElem.folderName && (
                        <div
                          className={styles.folderFiles}
                          style={openedFolder.includes(`folder-${curElem._id}`) ? { height: "fit-content", border: "1px solid #e6e6e6" } : { height: "0", border: "none" }}
                        >
                          <div style={{ height: "100%", overflowY: "scroll", position: "relative" }}>
                            {curElem.fileDetails.length > 0 ? (
                              curElem.fileDetails.map((cur) => {
                                let unreadFeeds = cur.feedBack.filter((curF) => {
                                  return curF.isRead === false;
                                });
                                return (
                                  <>
                                    <div className={styles.eachInsideCard} onClick={() => dispatch(selectFileCheckbox({ container: curElem, fileOrFold: cur, type: "inside" }))}>
                                      <div
                                        className="ps-2"
                                        style={{ width: detailsVersionTab === "" ? "25%" : "50%", fontSize: "14px", color: "#333333", fontWeight: "500", display: "flex", alignItems: "center" }}
                                      >
                                        <div
                                          className={addedFilesArr.includes(cur._id) ? styles.activeCheckbox : styles.customCheckbox}
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            dispatch(selectFileCheckbox({ container: curElem, fileOrFold: cur, type: "inside" }));
                                          }}
                                        >
                                          <BsCheck />
                                        </div>
                                        <div className="d-flex align-items-center me-1">
                                          {cur.fileType.split("/")[0] === "image" ? <IoMdImage color="#26AD74" fontSize={20} /> : <img src={pdfIcon} alt="" />}
                                        </div>
                                        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "0.5rem" }} onClick={(event) => event.stopPropagation()}>
                                          <a title={cur.fileName} className={styles.fileLinkName} href={cur.fileLink} target="_blank">
                                            {cur.fileName}
                                          </a>
                                        </div>
                                      </div>
                                      {detailsVersionTab === "" && (
                                        <>
                                          <div style={{ width: "15%", fontSize: "14px", color: "#333333", fontWeight: "400", paddingRight: "0.25rem" }}>
                                            {showInput === cur._id ? (
                                              <input
                                                autoFocus
                                                type="text"
                                                className={styles.eachCardInput}
                                                name="spaceName"
                                                value={spaceName}
                                                onChange={spaceDrawInput}
                                                onBlur={(event) => spaceDrawSubmit(curElem, event, cur, { container: curElem, file: cur, text: "Space Name Updated" })}
                                                onClick={(event) => event.stopPropagation()}
                                                onKeyDown={(event) => {
                                                  if (event.key === "Enter") {
                                                    spaceDrawSubmit(curElem, event, cur, { container: curElem, file: cur, text: "Space Name Updated" });
                                                  }
                                                }}
                                              />
                                            ) : (
                                              <div
                                                className={styles.spaceDrawDiv}
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  setSpaceName(cur.spaceName ? cur.spaceName : "-");
                                                  setSpaceNameTest(cur.spaceName ? cur.spaceName : "-");
                                                  setDrawType(cur.drawingType ? cur.drawingType : "-");
                                                  setDrawTypeTest(cur.drawingType ? cur.drawingType : "-");
                                                  setShowInput(cur._id);
                                                }}
                                              >
                                                {cur.spaceName ? cur.spaceName : "-"}
                                              </div>
                                            )}
                                          </div>
                                          <div style={{ width: "15%", fontSize: "14px", color: "#333333", fontWeight: "400", paddingRight: "0.25rem" }}>
                                            {showInput === cur._id ? (
                                              <input
                                                type="text"
                                                className={styles.eachCardInput}
                                                name="drawType"
                                                value={drawType}
                                                onChange={spaceDrawInput}
                                                onBlur={(event) => spaceDrawSubmit(curElem, event, cur, { container: curElem, file: cur, text: "Drawing Type Updated" })}
                                                onClick={(event) => event.stopPropagation()}
                                                onKeyDown={(event) => {
                                                  if (event.key === "Enter") {
                                                    spaceDrawSubmit(curElem, event, cur, { container: curElem, file: cur, text: "Drawing Type Updated" });
                                                  }
                                                }}
                                              />
                                            ) : (
                                              <div
                                                className={styles.spaceDrawDiv}
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  setSpaceName(cur.spaceName ? cur.spaceName : "-");
                                                  setSpaceNameTest(cur.spaceName ? cur.spaceName : "-");
                                                  setDrawType(cur.drawingType ? cur.drawingType : "-");
                                                  setDrawTypeTest(cur.drawingType ? cur.drawingType : "-");
                                                  setShowInput(cur._id);
                                                }}
                                              >
                                                {cur.drawingType ? cur.drawingType : "-"}
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                      <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "400" }}>{cur.lastUpdated}</div>
                                      <div
                                        style={{
                                          width: detailsVersionTab === "" ? "15%" : "20%",
                                          fontSize: "12px",
                                          color: "#333333",
                                          fontWeight: "400",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                        title={getFileStatus(cur)}
                                      >
                                        {getFileStatus(cur)}
                                      </div>
                                      {detailsVersionTab === "" && (
                                        <div style={{ width: "10%", fontSize: "18px", fontWeight: "400", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
                                          {showApprovalOrFeed({ container: curElem, file: cur }) !== "none" ? (
                                            showApprovalOrFeed({ container: curElem, file: cur }) === "approval" ? (
                                              <div className="d-flex">
                                                <div
                                                  className={styles.approveTick}
                                                  title="Approve"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    approveFiles({ container: curElem, file: cur });
                                                  }}
                                                >
                                                  <BsCheck />
                                                </div>
                                                <div className={styles.addFeed} title="Give Feedback" onClick={(event) => openGiveFeed(event, { container: curElem, file: cur })}>
                                                  <RiChatNewLine />
                                                </div>
                                              </div>
                                            ) : openedInfo?.file && openedInfo?.file?._id === cur?._id ? (
                                              <RiChatQuoteFill className={styles.commentButton} onClick={(event) => openInfo(event, { container: curElem, file: cur })} />
                                            ) : (
                                              <RiChatQuoteLine
                                                className={styles.commentButton}
                                                onClick={(event) => {
                                                  openInfo(event, { container: curElem, file: cur });
                                                  getFileFeedback({ container: curElem, file: cur });
                                                  readFeedback({ container: curElem, file: cur });
                                                }}
                                              />
                                            )
                                          ) : (
                                            "-"
                                          )}
                                          {unreadFeeds && unreadFeeds?.length > 0 && (
                                            <div
                                              style={{
                                                fontSize: "8px",
                                                backgroundColor: "#DD2E44",
                                                color: "#ffffff",
                                                width: "0.8rem",
                                                height: "0.8rem",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "50%",
                                                marginLeft: "0.25rem",
                                              }}
                                            >
                                              {unreadFeeds && unreadFeeds?.length}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      <div
                                        style={{ width: detailsVersionTab === "" ? "5%" : "10%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                                        onClick={(event) => event.stopPropagation()}
                                      >
                                        <Dropdown className="dropdownWithFixed" show={openedDrop === cur._id}>
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
                                                setOpenedDrop(cur._id);
                                              }
                                            }}
                                          >
                                            <HiEllipsisVertical />
                                          </Dropdown.Toggle>
                                          <Dropdown.Menu rootCloseEvent={() => setOpenedDrop("")}>
                                            <Dropdown.Item
                                              style={
                                                getFileStatus(cur) === "Approved" || getFileStatus(cur) === "In-Execution" || getFileStatus(cur) === "Approval Pending"
                                                  ? { fontSize: "12px", ...inlineInactive }
                                                  : { fontSize: "12px" }
                                              }
                                              onClick={() => {
                                                dispatch(selectFileFolderToBeRenamed({ container: curElem, fileOrFold: cur, type: "inside" }));
                                                dispatch(setModalState({ modal: "renameModal", state: true }));
                                              }}
                                            >
                                              Rename
                                            </Dropdown.Item>
                                            <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => dispatch(handleDetailsVersionBox({ item: { container: curElem, file: cur }, tab: "version" }))}>
                                              Version History
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              style={{ fontSize: "12px" }}
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                uploadNewVersion(curElem, cur);
                                              }}
                                            >
                                              Upload new version
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              style={
                                                getFileStatus(cur) === "Approved" || getFileStatus(cur) === "In-Execution" || getFileStatus(cur) === "Approval Pending"
                                                  ? { fontSize: "12px", ...inlineInactive }
                                                  : { fontSize: "12px" }
                                              }
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                dispatch(setFilesGoingFor("approval"));
                                                dispatch(saveArrayForApproval({ container: curElem, file: cur }));
                                                dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                                              }}
                                            >
                                              Send for Approval
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              style={
                                                getFileStatus(cur) === "In-Execution" || getFileStatus(cur) === "Approval Pending" ? { fontSize: "12px", ...inlineInactive } : { fontSize: "12px" }
                                              }
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                dispatch(setFilesGoingFor("execution"));
                                                dispatch(saveArrayForApproval({ container: curElem, file: cur }));
                                                dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                                              }}
                                            >
                                              Send for Execution
                                            </Dropdown.Item>
                                            <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => dispatch(handleDetailsVersionBox({ item: { container: curElem, file: cur }, tab: "details" }))}>
                                              File Details
                                            </Dropdown.Item>
                                            <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => downloadFile(cur)}>
                                              Download
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              style={{ fontSize: "12px" }}
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                dispatch(saveFilesToBeShared([{ container: curElem, file: cur }]));
                                                dispatch(setModalState({ modal: "shareModal", state: true }));
                                              }}
                                            >
                                              Share
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              style={
                                                getFileStatus(cur) === "Approved" || getFileStatus(cur) === "In-Execution" || getFileStatus(cur) === "Approval Pending"
                                                  ? { fontSize: "12px", ...inlineInactive }
                                                  : { fontSize: "12px", color: "red" }
                                              }
                                              onClick={() => deleteSingleFileOrFolder({ container: curElem, file: cur })}
                                            >
                                              Delete File
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    </div>

                                    <div className={styles.feedbackBox} style={openedInfo.file && openedInfo.file._id === cur._id ? { height: "fit-content" } : { height: "0" }}>
                                      <div className={styles.feedbackContainer}>
                                        {fileFeedArr &&
                                          fileFeedArr.map((eachFeed, index) => {
                                            return (
                                              <FeedbackCard
                                                feedData={eachFeed}
                                                currentVer={index === 0}
                                                name={openedInfo.file ? openedInfo.file.fileName : ""}
                                                containerAndFile={{ container: curElem, file: cur }}
                                                uploadNewVersionFunc={uploadNewVersion}
                                              />
                                            );
                                          })}
                                      </div>
                                    </div>
                                    <div className={styles.feedbackBox} style={openedGiveFeed.file && openedGiveFeed.file._id === cur._id ? { height: "fit-content" } : { height: "0" }}>
                                      <div className={styles.feedbackContainer}>
                                        <textarea name="feedbackText" rows="5" value={feedbackText} onChange={inputFeedback} className={styles.feedbackInput}></textarea>
                                        <div className="d-flex justify-content-end">
                                          <button className={styles.submitFeed} onClick={submitFeedback}>
                                            Submit Feedback
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })
                            ) : (
                              <div style={{ height: "5rem", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "18px", fontWeight: "600", color: "#888888" }}>
                                No files to show
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <div>No files to show</div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilesTable;
