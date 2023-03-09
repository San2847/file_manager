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
  handleDetailsVersionBox,
  saveArrayForApproval,
  saveFileToNewVersion,
  saveFolderToBeDeleted,
  savePrepareDeleteArr,
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
import { getFiles, saveFileChangesAsVersion } from "../../../Services/commonFunctions";
import DeleteFolderModal from "./DeleteFolderModal/DeleteFolderModal";
import { getUserId } from "../../../Services/authService";
import uuid from "react-uuid";

const FilesTable = ({ fileData }) => {
  const dispatch = useDispatch();
  const { fileCheckBoxArr, detailsVersionBox, detailsVersionTab, loading, versionConfirmationReturns, emptyFolderArr } = useSelector((state) => state.filemanager);

  const newVerUploadRef = useRef(null);

  const [addedFilesArr, setAddedFilesArr] = useState([]);

  const [openedFolder, setOpenedFolder] = useState("");

  const [spaceName, setSpaceName] = useState("");
  const [drawType, setDrawType] = useState("");
  const [spaceNameTest, setSpaceNameTest] = useState("");
  const [drawTypeTest, setDrawTypeTest] = useState("");
  const [showInput, setShowInput] = useState("");

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
      setOpenedFolder(`folder-${elem._id}`);
    } else {
      dispatch(selectFileCheckbox({ container: elem, fileOrFold: elem.fileDetails[0], type: "outside" }));
    }
    if (openedFolder === `folder-${elem._id}`) {
      setOpenedFolder("");
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

  const getFileStatus = (file) => {
    if (file.isSendForExecution === true) {
      return `In-Execution`;
    } else if (file.isSendForApproval === true) {
      return `Approval Pending`;
    } else if (file.isSelfApproved === true) {
      return `Self Approved`;
    } else {
      return `-`;
    }
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
    filesToUpload.append("bucketName", "idesignchat");
    filesToUpload.append("files", files[0]);
    const res = await putReq(`${apiLinks.s3api}/api/upload`, filesToUpload);
    if (res && !res.error) {
      const savRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-details`, {
        userId: getUserId(),
        fileDetails: [{ uuId: uuid(), fileName: files[0].name, fileLink: res.data.locations[0], fileType: files[0].type, fileSize: `${Math.round(files[0].size / 1024)} KB`, type: 1 }],
      });
      if (savRes && !savRes.error) {
        dispatch(saveFileToNewVersion({ container: savRes.data, file: savRes.data.fileDetails[0] }));
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

  const getFileInfo = async () => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-file-feedback?id=${openedInfo.container._id}&fileId=${openedInfo.file._id}`);
    if (res && !res.error) {
      console.log(res.data);
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
    const res = await postReq(`${apiLinks.pmt}/api/file-manager/send-feedback?id=${openedGiveFeed.container._id}&fileId=${openedGiveFeed.file._id}`, { sendBy: getUserId(), message: feedbackText });
    if (res && !res.error) {
      getFiles(1);
      setFileFeedArr([...res.data.fileDetails[0].feedBack]);
      setOpenedGiveFeed("");
      setFeedbackText("");
      console.log(res.data);
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
      console.log(res);
    } else {
      console.log(res.error);
    }
  };

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

  return (
    <>
      <RenameModal />
      <DeleteFolderModal />
      <input type="file" onChange={handleNewVersionUpload} className="d-none" ref={newVerUploadRef} />
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

      <div className="d-flex flex-column" style={{ height: "80%", overflowY: "scroll" }}>
        <div style={{ height: "fit-content" }}>
          {loading ? (
            <LoadingSekeleton />
          ) : (
            <>
              {fileData &&
                fileData.map((curElem) => {
                  let unreadFeeds = curElem.fileDetails[0].feedBack.filter((curF) => {
                    return curF.isRead === false;
                  });
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
                              style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
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
                                <a className={styles.fileLinkName} href={curElem.fileDetails[0] && curElem.fileDetails[0].fileLink} target="_blank">
                                  {curElem.fileDetails[0] && curElem.fileDetails[0].fileName}
                                </a>
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
                                      // onBlur={(event) => spaceDrawSubmit(curElem, event)}
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
                                      // onBlur={(event) => spaceDrawSubmit(curElem, event)}
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
                            }}
                          >
                            {curElem.folderName ? "" : curElem.fileDetails[0] && getFileStatus(curElem.fileDetails[0])}
                          </div>
                          {detailsVersionTab === "" && (
                            <div
                              className={styles.commentButton}
                              style={{ width: "10%", fontSize: "18px", fontWeight: "400", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
                            >
                              {!curElem.folderName &&
                                (curElem.fileDetails[0].isSendForApproval === false ? (
                                  openedInfo.file && openedInfo.file._id === curElem.fileDetails[0]._id ? (
                                    <RiChatQuoteFill onClick={(event) => openInfo(event, { container: curElem, file: curElem.fileDetails[0] })} />
                                  ) : (
                                    <RiChatQuoteLine
                                      onClick={(event) => {
                                        openInfo(event, { container: curElem, file: curElem.fileDetails[0] });
                                        getFileFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                        readFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                      }}
                                    />
                                  )
                                ) : curElem.fileDetails[0].feedBack.length === 0 ? (
                                  curElem.fileDetails[0].isSendForExecution === false ? (
                                    <div className="d-flex">
                                      <div className={styles.approveTick} title="Approve" onClick={(event) => openGiveFeed(event, { container: curElem, file: curElem.fileDetails[0] })}>
                                        <BsCheck />
                                      </div>
                                      <div className={styles.addFeed} title="Give Feedback" onClick={(event) => openGiveFeed(event, { container: curElem, file: curElem.fileDetails[0] })}>
                                        <RiChatNewLine />
                                      </div>
                                    </div>
                                  ) : openedInfo.file && openedInfo.file._id === curElem.fileDetails[0]._id ? (
                                    <RiChatQuoteFill onClick={(event) => openInfo(event, { container: curElem, file: curElem.fileDetails[0] })} />
                                  ) : (
                                    <RiChatQuoteLine
                                      onClick={(event) => {
                                        openInfo(event, { container: curElem, file: curElem.fileDetails[0] });
                                        getFileFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                        readFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                      }}
                                    />
                                  )
                                ) : openedInfo.file && openedInfo.file._id === curElem.fileDetails[0]._id ? (
                                  <RiChatQuoteFill onClick={(event) => openInfo(event, { container: curElem, file: curElem.fileDetails[0] })} />
                                ) : (
                                  <RiChatQuoteLine
                                    onClick={(event) => {
                                      openInfo(event, { container: curElem, file: curElem.fileDetails[0] });
                                      getFileFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                      readFeedback({ container: curElem, file: curElem.fileDetails[0] });
                                    }}
                                  />
                                ))}
                              {unreadFeeds.length > 0 && (
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
                                  {unreadFeeds.length}
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
                                  style={{ fontSize: "12px" }}
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
                                <Dropdown.Item
                                  style={{ fontSize: "12px" }}
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
                                  style={{ fontSize: "12px" }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch(setFilesGoingFor("execution"));
                                    dispatch(saveArrayForApproval({ container: curElem, file: curElem.fileDetails[0] }));
                                    dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                                  }}
                                >
                                  Send for Execution
                                </Dropdown.Item>
                                <Dropdown.Item style={{ fontSize: "12px" }}>Share</Dropdown.Item>
                                <Dropdown.Item
                                  style={{ fontSize: "12px", color: "red" }}
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
                          <div className={styles.feedbackBox} style={openedInfo.file && openedInfo.file._id === curElem.fileDetails[0]._id ? { height: "10rem" } : { height: "0" }}>
                            <div className={styles.feedbackContainer}>
                              {fileFeedArr &&
                                fileFeedArr.map((eachFeed, index) => {
                                  return <FeedbackCard feedData={eachFeed} currentVer={index === 0} />;
                                })}
                            </div>
                          </div>
                        )}
                        {!curElem.folderName && (
                          <div className={styles.feedbackBox} style={openedGiveFeed.file && openedGiveFeed.file._id === curElem.fileDetails[0]._id ? { height: "12rem" } : { height: "0" }}>
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
                          <div className={styles.folderFiles} style={openedFolder === `folder-${curElem._id}` ? { height: "10rem", border: "1px solid #e6e6e6" } : { height: "0", border: "none" }}>
                            <div style={{ height: "100%", overflowY: "scroll" }}>
                              {curElem.fileDetails &&
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
                                          <div
                                            title={cur.fileName}
                                            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "0.5rem" }}
                                            onClick={(event) => event.stopPropagation()}
                                          >
                                            <a className={styles.fileLinkName} href={cur.fileLink} target="_blank">
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
                                                  // onBlur={(event) => spaceDrawSubmit(curElem, event, cur)}
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
                                                  // onBlur={(event) => spaceDrawSubmit(curElem, event, cur)}
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
                                          <div
                                            className={styles.commentButton}
                                            style={{ width: "10%", fontSize: "18px", fontWeight: "400", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
                                          >
                                            {cur.isSendForApproval === false ? (
                                              openedInfo.file && openedInfo.file._id === cur._id ? (
                                                <RiChatQuoteFill onClick={(event) => openInfo(event, { container: curElem, file: cur })} />
                                              ) : (
                                                <RiChatQuoteLine
                                                  onClick={(event) => {
                                                    openInfo(event, { container: curElem, file: cur });
                                                    getFileFeedback({ container: curElem, file: cur });
                                                    readFeedback({ container: curElem, file: cur });
                                                  }}
                                                />
                                              )
                                            ) : cur.feedBack.length === 0 ? (
                                              cur.isSendForExecution === false ? (
                                                <div className="d-flex">
                                                  <div className={styles.approveTick} title="Approve" onClick={(event) => openGiveFeed(event, { container: curElem, file: cur })}>
                                                    <BsCheck />
                                                  </div>
                                                  <div className={styles.addFeed} title="Give Feedback" onClick={(event) => openGiveFeed(event, { container: curElem, file: cur })}>
                                                    <RiChatNewLine />
                                                  </div>
                                                </div>
                                              ) : openedInfo.file && openedInfo.file._id === cur._id ? (
                                                <RiChatQuoteFill onClick={(event) => openInfo(event, { container: curElem, file: cur })} />
                                              ) : (
                                                <RiChatQuoteLine
                                                  onClick={(event) => {
                                                    openInfo(event, { container: curElem, file: cur });
                                                    getFileFeedback({ container: curElem, file: cur });
                                                    readFeedback({ container: curElem, file: cur });
                                                  }}
                                                />
                                              )
                                            ) : openedInfo.file && openedInfo.file._id === cur._id ? (
                                              <RiChatQuoteFill onClick={(event) => openInfo(event, { container: curElem, file: cur })} />
                                            ) : (
                                              <RiChatQuoteLine
                                                onClick={(event) => {
                                                  openInfo(event, { container: curElem, file: cur });
                                                  getFileFeedback({ container: curElem, file: cur });
                                                  readFeedback({ container: curElem, file: cur });
                                                }}
                                              />
                                            )}
                                            {unreadFeeds.length > 0 && (
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
                                                {unreadFeeds.length}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        <div
                                          style={{ width: detailsVersionTab === "" ? "5%" : "10%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                                          onClick={(event) => event.stopPropagation()}
                                        >
                                          <Dropdown show={openedDrop === cur._id}>
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
                                                style={{ fontSize: "12px" }}
                                                onClick={() => {
                                                  dispatch(selectFileFolderToBeRenamed({ container: curElem, fileOrFold: cur, type: "inside" }));
                                                  dispatch(setModalState({ modal: "renameModal", state: true }));
                                                }}
                                              >
                                                Rename
                                              </Dropdown.Item>
                                              <Dropdown.Item
                                                style={{ fontSize: "12px" }}
                                                onClick={() => dispatch(handleDetailsVersionBox({ item: { container: curElem, file: cur }, tab: "version" }))}
                                              >
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
                                                style={{ fontSize: "12px" }}
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
                                                style={{ fontSize: "12px" }}
                                                onClick={(event) => {
                                                  event.stopPropagation();
                                                  dispatch(setFilesGoingFor("execution"));
                                                  dispatch(saveArrayForApproval({ container: curElem, file: cur }));
                                                  dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
                                                }}
                                              >
                                                Send for Execution
                                              </Dropdown.Item>
                                              <Dropdown.Item
                                                style={{ fontSize: "12px" }}
                                                onClick={() => dispatch(handleDetailsVersionBox({ item: { container: curElem, file: cur }, tab: "details" }))}
                                              >
                                                File Details
                                              </Dropdown.Item>
                                              <Dropdown.Item style={{ fontSize: "12px" }}>Share</Dropdown.Item>
                                              <Dropdown.Item style={{ color: "red", fontSize: "12px" }} onClick={() => deleteSingleFileOrFolder({ container: curElem, file: cur })}>
                                                Delete File
                                              </Dropdown.Item>
                                            </Dropdown.Menu>
                                          </Dropdown>
                                        </div>
                                      </div>

                                      <div className={styles.feedbackBox} style={openedInfo.file && openedInfo.file._id === cur._id ? { height: "10rem" } : { height: "0" }}>
                                        <div className={styles.feedbackContainer}>
                                          {fileFeedArr &&
                                            fileFeedArr.map((eachFeed, index) => {
                                              return <FeedbackCard feedData={eachFeed} currentVer={index === 0} />;
                                            })}
                                        </div>
                                      </div>
                                      <div className={styles.feedbackBox} style={openedGiveFeed.file && openedGiveFeed.file._id === cur._id ? { height: "12rem" } : { height: "0" }}>
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
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FilesTable;
