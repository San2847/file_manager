import React, { useEffect, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { IoMdImage } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fakeFiles } from "../../../constants/fakeJson";
import styles from "./filesTable.module.css";
import pdfIcon from "../../../Assets/pdfIcon.svg";
import { RiChatQuoteFill, RiChatQuoteLine } from "react-icons/ri";
import { HiEllipsisVertical } from "react-icons/hi2";
import { handleDetailsVersionBox, selectFileCheckbox, selectFileFolderToBeRenamed, setModalState } from "../../../Redux/slices/filemanagerSlice";
import FeedbackCard from "../FeedbackCard/FeedbackCard";
import { Dropdown } from "react-bootstrap";
import { AiOutlineArrowUp } from "react-icons/ai";
import LoadingSekeleton from "../../Common/LoadingSkeleton/LoadingSekeleton";
import RenameModal from "../RenameModal/RenameModal";

const FilesTable = ({ fileData }) => {
  const dispatch = useDispatch();
  const { fileCheckBoxArr, detailsVersionBox, detailsVersionTab, loading } = useSelector((state) => state.filemanager);

  const [fakeFilesArr, setFakeFilesArr] = useState(fakeFiles);
  const [addedFilesArr, setAddedFilesArr] = useState([]);

  const [openedFolder, setOpenedFolder] = useState("");

  const openFolderOrSelectFile = (elem) => {
    if (elem.fileDetails.length > 1) {
      setOpenedFolder(`folder-${elem._id}`);
    } else {
      dispatch(selectFileCheckbox({ container: elem, fileOrFold: elem.fileDetails[0], type: "outside" }));
    }
    if (openedFolder === `folder-${elem._id}`) {
      setOpenedFolder("");
    }
  };

  const [openedInfo, setOpenedInfo] = useState("");
  const openInfo = (event, id) => {
    event.stopPropagation();
    if (openedInfo === id) {
      setOpenedInfo("");
    } else {
      setOpenedInfo(id);
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

  const deleteFileOrFolder = async (item) => {
    console.log(item)
  }

  useEffect(() => {
    if (fileCheckBoxArr) {
      let x = fileCheckBoxArr.map((curElem) => {
        return curElem.fileOrFold._id;
      });
      setAddedFilesArr([...x]);
    }
  }, [fileCheckBoxArr]);

  const [prepareDeleteArr, setPrepareDeleteArr] = useState([]);
  useEffect(() => {
    let x = fileCheckBoxArr.map((curElem) => {
      return {
        id: curElem.container._id,
        fileId: curElem.fileOrFold._id,
      };
    });
    setPrepareDeleteArr([...x]);
  }, [fileCheckBoxArr]);

  return (
    <>
      <RenameModal />
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
            fileData &&
            fileData.map((curElem) => {
              return (
                <>
                  <div style={openedDrop === curElem._id ? { backgroundColor: "#f2f2f2", position: "relative", zIndex: "1000" } : { backgroundColor: "#f2f2f2" }}>
                    <div
                      className={curElem.fileDetails.length > 1 ? (openedFolder !== `folder-${curElem._id}` ? styles.folderCardNotOpened : styles.folderCard) : styles.eachCard}
                      onClick={() => openFolderOrSelectFile(curElem)}
                    >
                      <div style={{ width: detailsVersionTab === "" ? "25%" : "50%", fontSize: "14px", color: "#333333", fontWeight: "500", display: "flex", alignItems: "center" }}>
                        {curElem.fileDetails.length === 1 ? (
                          <div
                            className={addedFilesArr.includes(curElem.fileDetails[0]._id) ? styles.activeCheckbox : styles.customCheckbox}
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
                          {curElem.fileDetails.length > 1 ? (
                            <FaFolder color="#F2B007" fontSize={18} />
                          ) : curElem.fileDetails[0].fileType.split("/")[0] === "image" ? (
                            <IoMdImage color="#26AD74" fontSize={20} />
                          ) : (
                            <img src={pdfIcon} alt="" />
                          )}
                        </div>
                        <div
                          style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                          onClick={(event) => {
                            if (curElem.fileDetails.length === 1) {
                              event.stopPropagation();
                            }
                          }}
                        >
                          {curElem.fileDetails.length > 1 ? (
                            curElem.folderName ? (
                              curElem.folderName
                            ) : (
                              "Untitled"
                            )
                          ) : (
                            <a className={styles.fileLinkName} href={curElem.fileDetails[0].fileLink} target="_blank">
                              {curElem.fileDetails[0].fileName}
                            </a>
                          )}
                        </div>
                      </div>
                      {detailsVersionTab === "" && (
                        <>
                          <div style={{ width: "15%", fontSize: "14px", color: "#333333", fontWeight: "400", paddingRight: "0.25rem" }}>
                            {curElem.fileDetails.length === 1 && <input type="text" className={styles.eachCardInput} />}
                          </div>
                          <div style={{ width: "15%", fontSize: "14px", color: "#333333", fontWeight: "400", paddingRight: "0.25rem" }}>
                            {curElem.fileDetails.length === 1 && <input type="text" className={styles.eachCardInput} />}
                          </div>
                        </>
                      )}
                      <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "400" }}>
                        {curElem.fileDetails.length > 1 ? makeDateString(curElem.updatedAt) : curElem.fileDetails[0].updatedAt ? makeDateString(curElem.fileDetails[0].updatedAt) : "-"}
                      </div>
                      <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "400" }}>{curElem.fileDetails.length > 1 ? "" : "Approved"}</div>
                      {detailsVersionTab === "" && (
                        <div
                          className={styles.commentButton}
                          style={{ width: "10%", fontSize: "18px", fontWeight: "400", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
                        >
                          {curElem.fileDetails.length === 1 &&
                            (openedInfo === curElem.fileDetails[0]._id ? (
                              <RiChatQuoteFill onClick={(event) => openInfo(event, curElem.fileDetails[0]._id)} />
                            ) : (
                              <RiChatQuoteLine onClick={(event) => openInfo(event, curElem.fileDetails[0]._id)} />
                            ))}
                          {curElem.fileDetails.length === 1 && (
                            <div
                              style={{
                                fontSize: "8px",
                                backgroundColor: "#FBCCFF",
                                color: "#E61BF7",
                                width: "0.8rem",
                                height: "0.8rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%",
                                marginLeft: "0.25rem",
                              }}
                            >
                              2
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
                              }, 100);
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
                              onClick={() => {
                                if (curElem.fileDetails.length > 1) {
                                  dispatch(selectFileFolderToBeRenamed({ container: curElem, fileOrFold: curElem, type: "folder" }));
                                } else {
                                  dispatch(selectFileFolderToBeRenamed({ container: curElem, fileOrFold: curElem.fileDetails[0], type: "outside" }));
                                }
                                dispatch(setModalState({ modal: "renameModal", state: true }));
                              }}
                            >
                              Rename
                            </Dropdown.Item>
                            {curElem.fileDetails.length === 1 && (
                              <>
                                <Dropdown.Item
                                  style={{ fontSize: "12px" }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch(handleDetailsVersionBox({ item: curElem.fileDetails[0], tab: "version" }));
                                  }}
                                >
                                  Version History
                                </Dropdown.Item>
                                <Dropdown.Item style={{ fontSize: "12px" }}>Upload new version</Dropdown.Item>
                                <Dropdown.Item
                                  style={{ fontSize: "12px" }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch(handleDetailsVersionBox({ item: curElem.fileDetails[0], tab: "details" }));
                                  }}
                                >
                                  File Details
                                </Dropdown.Item>
                              </>
                            )}
                            <Dropdown.Item style={{ fontSize: "12px" }}>Share</Dropdown.Item>
                            <Dropdown.Item style={{ fontSize: "12px", color: "red" }} onClick={() => deleteFileOrFolder(curElem)}>Delete {curElem.fileDetails.length > 1 ? "Folder" : "File"}</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                    {curElem.fileDetails.length === 1 && (
                      <div className={styles.feedbackBox} style={openedInfo === curElem.fileDetails[0]._id ? { height: "10rem" } : { height: "0" }}>
                        <div className={styles.feedbackContainer}>
                          <FeedbackCard />
                          <FeedbackCard />
                        </div>
                      </div>
                    )}

                    {curElem.fileDetails.length > 1 && (
                      <div className={styles.folderFiles} style={openedFolder === `folder-${curElem._id}` ? { height: "10rem", border: "1px solid #e6e6e6" } : { height: "0", border: "none" }}>
                        <div style={{ height: "100%", overflowY: "scroll" }}>
                          {curElem.fileDetails &&
                            curElem.fileDetails.map((cur) => {
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
                                          <input type="text" className={styles.eachCardInput} />
                                        </div>
                                        <div style={{ width: "15%", fontSize: "14px", color: "#333333", fontWeight: "400", paddingRight: "0.25rem" }}>
                                          <input type="text" className={styles.eachCardInput} />
                                        </div>
                                      </>
                                    )}
                                    <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "400" }}>{cur.lastUpdated}</div>
                                    <div style={{ width: detailsVersionTab === "" ? "15%" : "20%", fontSize: "12px", color: "#333333", fontWeight: "400" }}>Approved</div>
                                    {detailsVersionTab === "" && (
                                      <div className={styles.commentButton} style={{ width: "10%", fontSize: "18px", fontWeight: "400", display: "flex", justifyContent: "center", cursor: "pointer" }}>
                                        {openedInfo === cur._id ? <RiChatQuoteFill onClick={(event) => openInfo(event, cur._id)} /> : <RiChatQuoteLine onClick={(event) => openInfo(event, cur._id)} />}
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
                                            }, 100);
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
                                          <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => dispatch(handleDetailsVersionBox({ item: cur, tab: "version" }))}>
                                            Version History
                                          </Dropdown.Item>
                                          <Dropdown.Item style={{ fontSize: "12px" }}>Upload new version</Dropdown.Item>
                                          <Dropdown.Item style={{ fontSize: "12px" }} onClick={() => dispatch(handleDetailsVersionBox({ item: cur, tab: "details" }))}>
                                            File Details
                                          </Dropdown.Item>
                                          <Dropdown.Item style={{ fontSize: "12px" }}>Share</Dropdown.Item>
                                          <Dropdown.Item style={{ color: "red", fontSize: "12px" }}>Delete File</Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </div>
                                  </div>

                                  <div className={styles.feedbackBox} style={openedInfo === cur._id ? { height: "10rem" } : { height: "0" }}>
                                    <div className={styles.feedbackContainer}>
                                      <FeedbackCard />
                                      <FeedbackCard />
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
            })
          )}
        </div>
      </div>
    </>
  );
};

export default FilesTable;
