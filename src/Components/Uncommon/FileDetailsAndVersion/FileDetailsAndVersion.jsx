import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { apiLinks } from "../../../constants/constants";
import { changeDetVerTab, handleDetailsVersionBox } from "../../../Redux/slices/filemanagerSlice";
import { getReq } from "../../../Services/api";
import { createDateString } from "../../../Services/commonFunctions";
import styles from "./fileDetailsAndVersion.module.css";
import { BsFileEarmarkFill } from "react-icons/bs";
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import { RiChatQuoteLine } from "react-icons/ri";

const FileDetailsAndVersion = () => {
  const disptach = useDispatch();
  const { detailsVersionTab, detailsVersionBox } = useSelector((state) => state.filemanager);

  const [loading, setLoading] = useState(false);

  const [versionData, setVersionData] = useState([]);
  const [userData, setUserData] = useState({});
  const [singleFile, setSingleFile] = useState({});

  const getFileTypeString = (fileT) => {
    let fileExt = fileT.split("/")[1].toUpperCase();
    let fileFormat = fileT.split("/")[0].split("");
    fileFormat[0] = fileFormat[0].toUpperCase();
    let newFileFormat = fileFormat.join("");
    return `${fileExt} ${newFileFormat}`;
  };

  const getUploaderDetails = async () => {
    const res = await getReq(
      `${apiLinks.crm}/api/listDesigners?apitoken=${process.env.REACT_APP_API_KEY}&designerId=${
        detailsVersionBox.container.userId ? detailsVersionBox.container.userId : singleFile.userId
      }&designerId=${detailsVersionBox.container.userId ? detailsVersionBox.container.userId : singleFile.userId}`
    );
    if (res && !res.error) {
      setUserData(res.data.data.data[0]);
    } else {
      console.log(res.error);
    }
  };

  const [shareWithDataArr, setShareWithDataArr] = useState([]);
  const getShareWithData = async (shareWithId) => {
    const res = await getReq(`${apiLinks.crm}/api/listDesigners?apitoken=${process.env.REACT_APP_API_KEY}&designerId=${shareWithId}&designerId=${shareWithId}`);
    if (res && !res.error) {
      setShareWithDataArr((prev) => {
        return [...prev, res.data.data.data[0]];
      });
    } else {
      console.log(res.error);
    }
  };

  useEffect(() => {
    setShareWithDataArr([]);
  }, [detailsVersionBox]);
  useEffect(() => {
    if (detailsVersionBox && detailsVersionBox.file && detailsVersionBox.file.shareWith) {
      detailsVersionBox.file.shareWith.forEach((curElem) => {
        getShareWithData(curElem);
      });
    }
  }, [detailsVersionBox]);

  const dataArray = [
    {
      label: "Upload Date",
      data: detailsVersionBox.container ? (detailsVersionBox.container.createdAt ? createDateString(detailsVersionBox.container.createdAt) : createDateString(singleFile.createdAt)) : "-",
    },
    {
      label: "File Type",
      data: detailsVersionBox.file ? getFileTypeString(detailsVersionBox.file.fileType) : "-",
    },
    {
      label: "Shared With",
      data:
        shareWithDataArr.length > 0
          ? shareWithDataArr.map((curElem) => {
              return `${curElem.fullName}, `;
            })
          : "-",
    },
    {
      label: "Last Modified on",
      data: detailsVersionBox.file && detailsVersionBox.file.updateTime ? createDateString(detailsVersionBox.file.updateTime) : "-",
    },
    {
      label: "File Size",
      data: detailsVersionBox.file ? detailsVersionBox.file.fileSize : "-",
    },
    {
      label: "Space Name",
      data: detailsVersionBox.file ? (detailsVersionBox.file.spaceName ? detailsVersionBox.file.spaceName : "-") : "-",
    },
    {
      label: "Drawing Type",
      data: detailsVersionBox.file ? (detailsVersionBox.file.drawingType ? detailsVersionBox.file.drawingType : "-") : "-",
    },
    {
      label: "Uploaded by",
      data: userData ? userData.fullName : "-",
    },
  ];

  const getFileVersions = async () => {
    setLoading(true);
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-file-versions?uuId=${detailsVersionBox.file.uuId}`);
    if (res && !res.error) {
      setVersionData([...res.data.reverse()]);
      setLoading(false);
    } else {
      console.log(res.error);
      setLoading(false);
    }
  };

  const getSingleFileDetails = async () => {
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-single-file?uuId=${detailsVersionBox.file.uuId}`);
    if (res && !res.error) {
      setSingleFile(res.data[0]);
    } else {
      console.log(res.error);
    }
  };

  useEffect(() => {
    if (detailsVersionTab === "version" && Object.keys(detailsVersionBox).length > 0) {
      getFileVersions();
    }
    if (detailsVersionTab === "details") {
      getUploaderDetails();
    }
    if (detailsVersionBox.container && !detailsVersionBox.container.folderName) {
      getSingleFileDetails();
    }
  }, [detailsVersionTab, detailsVersionBox]);

  return (
    <div className={styles.container}>
      <div className={styles.headingTabs}>
        <div className={styles.heading}>
          <div className={styles.headingName} title={detailsVersionBox.file && detailsVersionBox.file.fileName}>
            {detailsVersionBox.file && detailsVersionBox.file.fileName}
          </div>
          <div className={styles.closeButton} onClick={() => disptach(handleDetailsVersionBox({ item: {}, tab: "" }))}>
            <AiOutlineClose />
          </div>
        </div>
        <div className={styles.tabsContainer}>
          <div className={`${styles.eachTab} ${detailsVersionTab === "details" && styles.activeTab}`} onClick={() => disptach(changeDetVerTab("details"))}>
            Details
          </div>
          <div className={`${styles.eachTab} ${detailsVersionTab === "version" && styles.activeTab}`} onClick={() => disptach(changeDetVerTab("version"))}>
            Version History
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {detailsVersionTab === "details" ? (
          dataArray.map((curElem) => {
            return (
              <div className="mb-2">
                <div className={styles.dataLabel}>{curElem.label}</div>
                <div className={styles.dataData}>{curElem.data}</div>
              </div>
            );
          })
        ) : detailsVersionTab === "version" ? (
          loading ? (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" />
            </div>
          ) : (
            versionData.map((curElem) => {
              return (
                <div className={styles.notifBox}>
                  <div className={styles.notifHead}>
                    <div className="d-flex align-items-center" style={{ width: "80%" }}>
                      <div className="h-100">
                        <BsFileEarmarkFill color="#43A6DD" fontSize={14} style={{ marginRight: "0.25rem" }} />
                      </div>
                      {curElem.feedBack && curElem.feedBack.length > 0 ? (
                        <div style={{ fontSize: "14px", width: "90%" }}>
                          <b>{curElem && curElem.fileName}</b>
                          {curElem.versionText && !curElem.versionText.includes("execution")
                            ? curElem.versionText.split("~-+-~")
                              ? ` ${curElem.versionText.split("~-+-~")[0] ? curElem.versionText.split("~-+-~")[0] : ""}`
                              : ""
                            : curElem.versionText.split("-+-")
                            ? `Reason: ${curElem.version.split("-+-")[1]}`
                            : ""}
                        </div>
                      ) : (
                        <div style={{ fontSize: "14px", width: "90%" }}>
                          <b>{curElem && curElem.fileName}</b>
                          {curElem.versionText ? ` ${curElem.versionText.includes("execution") ? `${curElem.versionText.split("-+-")[0]} Reason: ${curElem.versionText.split("-+-")[1]}` : ""}` : ""}
                        </div>
                      )}
                    </div>
                    <div>
                      {curElem.feedBack && curElem.feedBack.length > 0 && <RiChatQuoteLine style={{ marginRight: "0.25rem" }} />}
                      <a href={curElem.fileLink} target="_blank" style={{ textDecoration: "none", color: "#000000" }}>
                        <HiOutlineDocumentMagnifyingGlass />
                      </a>
                    </div>
                  </div>
                  <div>
                    {curElem.feedBack && curElem.feedBack.length > 0 && (
                      <div style={{ fontSize: "12px", width: "100%", backgroundColor: "#ffffff", padding: "0.5rem", borderRadius: "4px" }}>
                        {curElem.versionText && curElem.versionText.split("~-+-~") ? ` ${curElem.versionText.split("~-+-~")[1] ? curElem.versionText.split("~-+-~")[1] : ""}` : ""}
                      </div>
                    )}
                  </div>
                  <div className={styles.dateString}>{curElem.updateTime ? createDateString(curElem.updateTime) : ""}</div>
                </div>
              );
            })
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default FileDetailsAndVersion;
