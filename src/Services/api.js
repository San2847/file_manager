import axios from "axios";
import { getLoginId, getToken } from "./authService";
import store from "../Redux/store";
import { setFileUploadProgress } from "../Redux/slices/filemanagerSlice";

export const postReq = (url, payload) => {
  return axios
    .post(url, payload)
    .then((response) => response)
    .catch((error) => {
      // console.log(error);
      return { error: error };
    });
};

export const getReq = (url, payload, headers) => {
  return axios
    .get(url, {
      headers: headers || { "x-auth-token": getToken() },
      data: payload,
    })
    .then((response) => response)
    .catch((error) => {
      // console.log(error);
      return { error: error };
    });
};

export const postTReq = (url, payload, headers) => {
  return axios
    .post(url, payload, {
      headers: headers || { Authorization: getToken() },
    })
    .then((response) => response)
    .catch((error) => {
      // console.log(error);
      return { error: error };
    });
};

export const delReq = (url, payload) => {
  return axios
    .delete(url, {
      header: {
        "Access-Control-Allow-Origin": "*",
      },
      data: payload,
    })
    .then((response) => response)
    .catch((error) => {
      return { error: error };
    });
};

export const putReq = (url, payload) => {
  return axios
    .put(url, payload, {
      headers: { Authorization: getToken() },
      onUploadProgress: (progressEvent) => {
        const percentage = (progressEvent.loaded / progressEvent.total) * 100;
        store.dispatch(setFileUploadProgress(percentage.toFixed(2)));
      },
    })
    .then((response) => response)
    .catch((error) => {
      return { error: error };
    });
};

export const callAPI = async (method = "POST", url = "", data = {}, resType = "json") => {
  try {
    if (method !== "GET") {
      const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (resType !== "json") {
        return response;
      }
      return response.json();
    } else {
      const response = await fetch(url, {
        method: method,
        mode: "no-cors",
      });
      if (resType !== "json") {
        return response;
      }
      return response.json();
    }
  } catch (error) {
    console.log(error);
    return { error: "error" };
  }
};

export const getAllCon = async () => {
  return await getReq(`https://chat.idesign.market/conversation/${getLoginId()}`, {});
};
