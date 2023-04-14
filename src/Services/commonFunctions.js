import { apiLinks, monthArr } from "../constants/constants";
import { clearArrayForApproval, saveAllEmptyFiles, saveEmptyFolders, saveFileAndFolder, saveOnlyFiles, saveTeamMemberArray, setLoadingState, setModalState } from "../Redux/slices/filemanagerSlice";
import store from "../Redux/store";
import { getReq, postReq } from "./api";
import { getUserId } from "./authService";

export const getFiles = async (status, id) => {
  if (status === 1) {
    store.dispatch(setLoadingState(true));
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-files?userId=${getUserId()}&projectId=${id}&type=1`);
    if (res && !res.error) {
      let sortedItems = res.data.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      // this one to delete any empty file containers
      let z = res.data.filter((curElem) => {
        return curElem.fileDetails.length === 0 && curElem.folderName === undefined;
      });
      store.dispatch(saveFileAndFolder([...sortedItems]));
      store.dispatch(saveAllEmptyFiles([...z].flat()));
      store.dispatch(setLoadingState(false));
    } else {
      console.log(res.error);
      store.dispatch(setLoadingState(false));
    }
  } else {
    store.dispatch(setLoadingState(true));
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-files?userId=${getUserId()}&projectId=${id}&type=1&status=${status}`);
    if (res && !res.error) {
      let sortedItems = res.data.sort((a, b) => {
        return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
      });
      store.dispatch(saveOnlyFiles([...sortedItems]));
      store.dispatch(setLoadingState(false));
    } else {
      console.log(res.error);
      store.dispatch(setLoadingState(false));
    }
  }
};

export const createDateString = (dateStr) => {
  let dateObj = new Date(dateStr);
  let date = dateObj.getDate();
  let month = monthArr[dateObj.getMonth()];
  let year = dateObj.getFullYear();
  return `${date}-${month}-${year}`;
};

export const saveFileChangesAsVersion = async (contFile, uuId, projId) => {
  let obj = {
    userId: getUserId(),
  };
  if (uuId) {
    let y = contFile.file;
    y["updateTime"] = new Date();
    y["versionText"] = contFile.text;
    y["uuId"] = uuId;
    delete y["_id"];
    obj["fileDetails"] = y;
    const verRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-versions`, obj);
    if (verRes && !verRes.error) {
      getFiles(1, projId);
    } else {
      console.log(verRes.error);
    }
  } else {
    if (contFile.file.length && contFile.file.length > 0) {
      obj["folderName"] = contFile.container.folderName;
      let y = contFile.file;
      y.forEach((curElem) => {
        curElem["updateTime"] = new Date();
        curElem["versionText"] = contFile.text;
        delete curElem["_id"];
      });
      obj["fileDetails"] = y;
      const verRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-versions`, obj);
      if (verRes && !verRes.error) {
        getFiles(1, projId);
      } else {
        console.log(verRes.error);
      }
    } else {
      const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-single-file?uuId=${contFile.file.uuId}`);
      if (res && !res.error) {
        if (!contFile.container.folderName) {
          let x = res.data[0].fileDetails;
          x[0]["updateTime"] = new Date();
          x[0]["versionText"] = contFile.text;
          delete x[0]["_id"];
          obj["fileDetails"] = x;
          const verRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-versions`, obj);
          if (verRes && !verRes.error) {
            getFiles(1, projId);
          } else {
            console.log(verRes.error);
          }
        } else {
          obj["folderName"] = contFile.container.folderName;
          let y = res.data[0].fileDetails;
          let z = y.filter((curElem) => {
            return curElem.uuId === contFile.file.uuId;
          });
          z[0]["updateTime"] = new Date();
          z[0]["versionText"] = contFile.text;
          delete z[0]["_id"];
          obj["fileDetails"] = z;
          const verRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-versions`, obj);
          if (verRes && !verRes.error) {
            getFiles(1, projId);
          } else {
            console.log(verRes.error);
          }
        }
      } else {
        console.log(res.error);
      }
    }
  }
};

export const approveFile = async (fileObj, modalName, projId) => {
  // const res = await postReq(`${apiLinks.pmt}/api/file-manager/self-approved?type=2`, { approvedBy: getUserId(), files: [{ id: fileObj.container._id, fileId: fileObj.file._id }] });
  // if (res && !res.error) {
  //   store.dispatch(setModalState({ modal: modalName, state: false }));
  //   store.dispatch(clearArrayForApproval());
  //   getFiles(1);
  // } else {
  //   console.log(res.error);
  // }

  const res = await postReq(`${apiLinks.pmt}/api/file-manager/edit-file?id=${fileObj.container._id}&fileId=${fileObj.file._id}&userId=${getUserId()}`, { status: 2 });
  if (res && !res.error) {
    store.dispatch(setModalState({ modal: modalName, state: false }));
    store.dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
    // store.dispatch(clearArrayForApproval());
    getFiles(1, projId);
  } else {
    store.dispatch(setModalState({ modal: modalName, state: false }));
    store.dispatch(setModalState({ modal: "sendApprovalModal", state: true }));
    // store.dispatch(clearArrayForApproval());
    getFiles(1, projId);
    console.log(res.error);
  }
};

export const getFileStatus = (file) => {
  if (file) {
    if (file.status === 2) {
      return `Approved`;
    } else {
      if (file.isSendForExecution === true) {
        return `In-Execution`;
      } else if (file.isSendForApproval === true) {
        return `Approval Pending`;
      } else if (file.isSelfApproved === true) {
        return `Self Approved`;
      } else {
        return `-`;
      }
    }
  }
};

export const getTeamMembers = async () => {
  const res = await getReq(`${apiLinks.crm}/api/enterprise/get-team-member`);
  if (res && !res.error) {
    store.dispatch(saveTeamMemberArray([...res.data.data]));
  } else {
    console.log(res.error);
  }
};

export const showApprovalOrFeed = (file) => {
  if (file) {
    if (file.feedBack.length > 0) {
      if (file.status === 2) {
        return "feed";
      } else {
        if (file && file.approvalRequestTo === getUserId()) {
          if (file.feedBack.length > 0) {
            return "feed";
          } else {
            if (file.isSendForApproval === true) {
              if (file.isSendForExecution === true) {
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
      if (file.status === 2) {
        return "none";
      } else {
        if (file && file.approvalRequestTo === getUserId()) {
          if (file.isSendForApproval === true) {
            if (file.isSendForExecution === true) {
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

export const scrollFileContainerToTop = () => {
  const ele = document.getElementById("file-container-div");
  ele.scrollTop = 0;
};
