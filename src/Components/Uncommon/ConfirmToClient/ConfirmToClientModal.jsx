import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ConfirmToClient.module.css'
import { clearArrayForApproval, clearFileCheckbox, inputNotifyMessage, saveProfileData, selectInternalTab, setModalState } from '../../../Redux/slices/filemanagerSlice';
import { postReq } from '../../../Services/api';
import { apiLinks } from '../../../constants/constants';
import { getFiles, saveFileChangesAsVersion } from '../../../Services/commonFunctions';
import { useParams } from 'react-router-dom';
import { getUserId } from '../../../Services/authService';

function ConfirmToClientModal() {
    const { confirmToClient, dataForClientApproval, clientId, filesGoingFor, arrayForApproval, notifyMessage } = useSelector((state) => state.filemanager);
    const [selectedTeamMember, setSelectedTeamMember] = useState({});

    const dispatch = useDispatch();
    const { id } = useParams();

    console.log({ arrayForApproval })

    // file sending to client for approval
    const submitFilesForApprovalOrExecution = async () => {
        const obj = {};
        if (filesGoingFor === "approvalForClient") {
            obj["approvalRequestTo"] = clientId;

        } else {
            obj["approvalRequestTo"] = clientId;
        }
        let arr = [];
        arrayForApproval.forEach((curElem) => {
            arr.push({ id: curElem.container._id, fileId: curElem.file._id });
        });
        obj["files"] = arr;
        if (filesGoingFor === "approvalForClient") {
            const res = await postReq(`${apiLinks.pmt}/api/file-manager/send-file-approval?isSharedWithClient=${1}`, obj);
            if (res && !res.error) {
                dispatch(clearArrayForApproval());
                dispatch(inputNotifyMessage(""));
                dispatch(setModalState({ modal: "confirmToClient", state: false }));
                // saveFileChangesAsVersion({ container: arrayForApproval[0].container, file: arrayForApproval[0].file, text: `File sent for approval to ${selectedTeamMember.memberName}` }, undefined, id);
                dispatch(clearFileCheckbox());
                getFiles(1, id, 1);
                dispatch(selectInternalTab("client"))
            } else {
                console.log(res.error);
            }
        } else {
            if (notifyMessage) {
                const res = await postReq(`${apiLinks.pmt}/api/file-manager/send-file-execution`, obj);
                if (res && !res.error) {
                    dispatch(clearArrayForApproval());
                    dispatch(setModalState({ modal: "sendApprovalModal", state: false }));
                    saveFileChangesAsVersion({
                        container: arrayForApproval[0].container,
                        file: arrayForApproval[0].file,
                        text: `File sent for execution to ${selectedTeamMember.memberName} - ${notifyMessage}`,
                    }, undefined, id);
                    arr.forEach(async (curel) => {
                        const feedRes = await postReq(`${apiLinks.pmt}/api/file-manager/send-feedback?id=${curel.container._id}&fileId=${curel.file._id}`, {
                            sendBy: getUserId(),
                            message: `${notifyMessage}~-+-~${saveProfileData.fullName}`,
                        });
                        if (feedRes && !feedRes.error) {
                        } else {
                            console.log(feedRes.error);
                        }
                    });
                    dispatch(inputNotifyMessage(""));
                    dispatch(clearFileCheckbox());
                    getFiles(3, id);
                } else {
                    console.log(res.error);
                }
            }
        }
    };

    return (
        <>
            <Modal show={confirmToClient} centered size="md">
                <Modal.Header ><p style={{ fontWeight: 500, fontSize: "24px" }}>{"Send Approval To Client"}</p></Modal.Header>
                <Modal.Body className={styles.modalBody}>

                    <button
                        className={styles.noButton}
                        onClick={() => {
                            dispatch(setModalState({ modal: "confirmToClient", state: false }));
                            dispatch(clearArrayForApproval());
                            dispatch(inputNotifyMessage(""));
                        }}
                    >
                        Cancel
                    </button>
                    <button className={styles.confirm} onClick={submitFilesForApprovalOrExecution}
                    >
                        Confirm
                    </button>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default ConfirmToClientModal