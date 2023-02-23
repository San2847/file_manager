import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,

  fileFolderArr: [],

  fileTypeTab: "all",
  internalTab: "internal",
  fileCheckBoxArr: [],

  detailsVersionBox: {},
  detailsVersionTab: "",

  uploadFileModal: false,
  shareFilesToModal: false,
  renameModal: false,

  fileUploadProgress: 0,
  fileFolderToBeRenamed: {},
};

export const filemanagerSlice = createSlice({
  name: "filemanagerSlice",
  initialState,
  reducers: {
    setLoadingState: (state, action) => {
      state.loading = action.payload;
    },

    saveFileAndFolder: (state, action) => {
      state.fileFolderArr = action.payload;
    },

    selectFileTypeTab: (state, action) => {
      state.fileTypeTab = `${action.payload}`;
    },
    selectInternalTab: (state, action) => {
      state.internalTab = `${action.payload}`;
    },

    selectFileCheckbox: (state, action) => {
      let x = state.fileCheckBoxArr.map((curElem) => {
        return curElem.fileOrFold._id;
      });
      if (!x.includes(action.payload.fileOrFold._id)) {
        state.fileCheckBoxArr = [...state.fileCheckBoxArr, action.payload];
      } else {
        let y = state.fileCheckBoxArr.filter((curElem) => {
          return curElem.fileOrFold._id !== action.payload.fileOrFold._id;
        });
        state.fileCheckBoxArr = y;
      }
    },

    handleDetailsVersionBox: (state, action) => {
      state.detailsVersionTab = action.payload.tab;
      state.detailsVersionBox = action.payload.item;
    },

    changeDetVerTab: (state, action) => {
      state.detailsVersionTab = action.payload;
    },

    setModalState: (state, action) => {
      state[action.payload.modal] = action.payload.state;
    },

    setFileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },

    selectFileFolderToBeRenamed: (state, action) => {
      state.fileFolderToBeRenamed = action.payload;
    },
  },
});

export const {
  setLoadingState,
  saveFileAndFolder,
  selectFileTypeTab,
  selectInternalTab,
  selectFileCheckbox,
  handleDetailsVersionBox,
  changeDetVerTab,
  setModalState,
  setFileUploadProgress,
  selectFileFolderToBeRenamed,
} = filemanagerSlice.actions;

export default filemanagerSlice.reducer;
