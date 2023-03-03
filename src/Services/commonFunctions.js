import { apiLinks } from "../constants/constants";
import { saveFileAndFolder, saveOnlyFiles, setLoadingState } from "../Redux/slices/filemanagerSlice";
import store from "../Redux/store";
import { getReq } from "./api";
import { getUserId } from "./authService";

export const getFiles = async (status) => {
  if (status === 1) {
    store.dispatch(setLoadingState(true));
    const res = await getReq(`${apiLinks.pmt}/api/file-manager/get-files?userId=${getUserId()}&type=1`);
    if (res && !res.error) {
      let x = res.data.filter((curElem) => {
        return curElem.fileDetails.length > 1;
      });
      let y = res.data.filter((curElem) => {
        return curElem.fileDetails.length === 1;
      });
      store.dispatch(saveFileAndFolder([...x, ...y]));
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
