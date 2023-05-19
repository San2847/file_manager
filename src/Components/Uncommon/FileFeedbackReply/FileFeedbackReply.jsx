import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import input_circle from '../../../Assets/input_circle.svg'
import { changeDetVerTab, handleDetailsVersionBox, saveFeedbackTemp, saveFileToNewVersion, saveNewFileForVersion, setModalState, setVersionConfirmationReturns } from "../../../Redux/slices/filemanagerSlice";
import styles from "./filefeedbackReply.module.css";
import moment from "moment/moment";
import { apiLinks } from "../../../constants/constants";
import { getReq, postReq, putReq } from "../../../Services/api";
import { getUserId } from "../../../Services/authService";
import { getFiles } from "../../../Services/commonFunctions";
import { useParams } from "react-router-dom";

const FileFeedbackReply = ({ feedData, currentVer, name, containerAndFile, uploadNewVersionFunc, getFeedbackRefresh }) => {
    const { detailsVersionBox, profileData, feedbackTempArr } = useSelector((state) => state.filemanager);

    const [fileFeedArr, setFileFeedArr] = useState([]);

    const [replyText, setReplyText] = useState("");
    const disptach = useDispatch();
    const dispatch = useDispatch();
    const newVerUploadRef = useRef(null);
    const { id } = useParams();


    const [mainBoxData, setMainBoxData] = useState(false);
    useEffect(() => {
        if (feedbackTempArr) {
            let x = feedbackTempArr.some((curElem) => {
                return curElem.feedBack.length > 0
            })
            setMainBoxData(x)
        }
    }, [feedbackTempArr])

    console.log(feedbackTempArr)
    console.log(detailsVersionBox)

    const sendReply = async () => {
        if (replyText) {
            const res = await postReq(`${apiLinks.pmt}/api/file-manager/save-new-feedback?id=${detailsVersionBox?.container?._id}&fileId=${detailsVersionBox?.file?._id}`, {
                "feedback": {
                    sendBy: getUserId(),
                    message: `${replyText}~-+-~${profileData.fullName}`,
                }
            }
            );
            console.log(res)
            if (res.data) {
                setReplyText("")
                getFileFeedback({ container: detailsVersionBox?.container, file: detailsVersionBox?.file })
                // disptach(handleDetailsVersionBox({ item: {}, tab: "" }))
                getFiles(1, id);
                // window.location.reload();
            }
        }
    };


    //get All Files Detail

    const getFileFeedback = async (fileObj) => {
        console.log({ fileObj })
        const feres = await getReq(`${apiLinks.pmt}/api/file-manager/get-file-versioning?uuId=${fileObj.file.uuId}`);
        console.log({ feres })
        if (feres && !feres.error) {
            setFileFeedArr([...feres.data.reverse()]);
            dispatch(saveFeedbackTemp([...feres.data]))
        } else {
            console.log(feres.error);
        }
    }

    //function for uploading new version start ====
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
            const verRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-versions?uuId=${feedbackTempArr[0].uuId}`);
            console.log(verRes)
            dispatch(saveNewFileForVersion({ fileName: files[0].name, fileLink: res.data.locations[0], fileType: files[0].type, fileSize: `${Math.round(files[0].size / 1024)}kB`, type: 1 }));
            dispatch(setModalState({ modal: "uploadNewVersion", state: true }));
            // getFileFeedback({ container: detailsVersionBox.container, file: detailsVersionBox.file })
            dispatch(setVersionConfirmationReturns(false));
            // disptach(handleDetailsVersionBox({ item: {}, tab: "" }))
            // window.reload();
        } else {
            console.log(res.error);
            dispatch(setVersionConfirmationReturns(false));
        }
    };
    //======uploading new version end here 
    return (
        <>
            {
                mainBoxData ?
                    <>
                        <input type="file" onChange={handleNewVersionUpload} className="d-none" ref={newVerUploadRef} />
                        <div className={styles.container}>
                            <div className={styles.heading}>
                                <div className={styles.headingName} title={detailsVersionBox?.file && detailsVersionBox?.file?.fileName}>
                                    {detailsVersionBox?.file && detailsVersionBox?.file?.fileName}
                                </div>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <button className={styles.uploadButton} onClick={() => uploadNewVersion(detailsVersionBox?.container, detailsVersionBox?.container?.fileDetails[0])}><img src={input_circle} alt="" /> <span >Upload new version</span></button>
                                    </div>
                                    <div className={styles.closeButton} onClick={() => disptach(handleDetailsVersionBox({ item: {}, tab: "" }))}>
                                        <AiOutlineClose />
                                    </div>
                                </div>
                            </div>
                            <hr style={{ margin: 0 }} />
                            <div className={styles.tabsContainer}>
                                {feedbackTempArr.map((item, inx) => {
                                    return (
                                        <>
                                            {
                                                item?.version === "V1" ?
                                                    <div>
                                                        <div className={styles.newVersionText}>
                                                            <h5> Uploaded {item?.fileName} file</h5>
                                                            <p>{moment(item.versionDateTime).format(` MMMM DD, yyyy`)}&nbsp;{'-'}&nbsp;{moment(new Date(item.versionDateTime ? item.versionDateTime : item.createdDateTime), "HH:mm:ss").format("LT")}</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <div className={styles.newVersionText}>
                                                            <h5> version updated to {item?.fileName}</h5>
                                                            <p>{moment(item.versionDateTime).format(` MMMM DD, yyyy`)}&nbsp;{'-'}&nbsp;{moment(new Date(item.versionDateTime ? item.versionDateTime : item.createdDateTime), "HH:mm:ss").format("LT")}</p>
                                                        </div>
                                                    </div>
                                            }
                                            {item.feedBack.length ?
                                                <>
                                                    <br />
                                                    <div className={styles.chatBox}>

                                                        <div>
                                                            {item.feedBack?.map((data, inx) => {
                                                                console.log(data)
                                                                return (
                                                                    <div style={{ paddingTop: '10px' }}>
                                                                        <div className="d-flex">
                                                                            <div className={styles.chat}>{data?.message?.split('~-+-~')[1]}</div>
                                                                            <span className={styles.chatHeaderVersion}><span>{item?.version}</span></span>
                                                                            <span className={styles.chatTime}><span>{moment(new Date(data.dateTime), "HH:mm:ss").format("LT")}</span></span>
                                                                        </div>
                                                                        <div className={styles.chatHeader}>{data?.message?.split('~-+-~')[0]}</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <br />
                                                </>
                                                : ""
                                            }
                                        </>
                                    )
                                })}

                            </div>
                            <div>
                                <hr style={{ margin: 0 }} />
                                <footer >
                                    <div className={styles.chatFooter} >
                                        <input placeholder="Write a feedback here" onChange={(event) => setReplyText(event.target.value)} value={replyText} />
                                        <button type="submit" onClick={sendReply}>Send</button>
                                    </div>
                                </footer >
                            </div>

                        </div >
                    </>
                    :
                    <div className={styles.container}>
                        <div className={styles.heading}>
                            <div className={styles.headingName} title={detailsVersionBox?.file && detailsVersionBox?.file?.fileName}>
                                {detailsVersionBox?.file && detailsVersionBox?.file.fileName}
                            </div>
                            <div className="d-flex align-items-center">
                                <div className={styles.closeButton} onClick={() => disptach(handleDetailsVersionBox({ item: {}, tab: "" }))}>
                                    <AiOutlineClose />
                                </div>
                            </div>
                        </div>
                        <hr style={{ margin: 0 }} />
                        <div className={styles.tabsContainer}>
                            <div className={styles.firstFeedBack}>
                                <div>
                                    <textarea placeholder="Write a feedback here " onChange={(event) => setReplyText(event.target.value)} value={replyText} />
                                </div>
                                <div>
                                    <button type="submit" onClick={sendReply}><span>Submit</span></button>
                                </div>
                            </div>
                        </div>
                    </div >
            }

        </>
    );
};

export default FileFeedbackReply;
