import { apiLinks, monthArr } from "../constants/constants";
import { saveAllEmptyFiles, saveEmptyFolders, saveFileAndFolder, saveOnlyFiles, setLoadingState } from "../Redux/slices/filemanagerSlice";
import store from "../Redux/store";
import { getReq, postReq } from "./api";
import { getUserId } from "./authService";

export const getFiles = async (status) => {
  if (status === 1) {
    store.dispatch(setLoadingState(true));
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-files?userId=${getUserId()}&type=1`);
    if (res && !res.error) {
      let x = res.data.filter((curElem) => {
        return curElem.folderName !== undefined;
      });
      let y = res.data.filter((curElem) => {
        return !curElem.folderName;
      });
      let emptyFolders = res.data.filter((curElem) => {
        return curElem.folderName && curElem.fileDetails.length === 0;
      });
      let updatedItemArray = y.filter((curElem) => {
        return curElem.fileDetails[0].updateTime !== undefined;
      });
      let otherItemArray = y.filter((curElem) => {
        return !curElem.updateTime;
      });

      updatedItemArray.sort((a, b) => new Date(a.fileDetails[0].updateTime).getTime() - new Date(b.fileDetails[0].updateTime).getTime());

      // this one to delete any empty file containers
      let z = res.data.filter((curElem) => {
        return curElem.fileDetails.length === 0 && curElem.folderName === undefined;
      });
      store.dispatch(saveFileAndFolder([...x.reverse(), ...updatedItemArray.reverse(), ...otherItemArray]));
      store.dispatch(saveAllEmptyFiles([...z].flat()));
      store.dispatch(saveEmptyFolders([...emptyFolders]));
      store.dispatch(setLoadingState(false));
    } else {
      console.log(res.error);
      store.dispatch(setLoadingState(false));
    }
  } else {
    store.dispatch(setLoadingState(true));
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-files?userId=${getUserId()}&type=1&status=${status}`);
    if (res && !res.error) {
      store.dispatch(saveOnlyFiles(res.data));
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

export const saveFileChangesAsVersion = async (contFile) => {
  let obj = {
    userId: getUserId(),
  };
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
        getFiles(1);
      } else {
        console.log(verRes.error);
      }
    } else {
      obj["folderName"] = contFile.container.folderName;
      let y = res.data[0].fileDetails;
      y[0]["updateTime"] = new Date();
      y[0]["versionText"] = contFile.text;
      delete y[0]["_id"];
      obj["fileDetails"] = y;
      obj["versionText"] = contFile.text;
      const verRes = await postReq(`${apiLinks.pmt}/api/file-manager/save-file-versions`, obj);
      if (verRes && !verRes.error) {
        getFiles(1);
      } else {
        console.log(verRes.error);
      }
    }
  } else {
    console.log(res.error);
  }
};
