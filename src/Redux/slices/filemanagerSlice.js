import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,

  fileFolderArr: [],
  onlyFilesArr: [],
  emptyFolderArr: [],

  fileTypeTab: "all",
  internalTab: "internal",
  fileCheckBoxArr: [],

  detailsVersionBox: {},
  detailsVersionTab: "",

  uploadFileModal: false,
  shareFilesToModal: false,
  renameModal: false,
  deleteModal: false,
  sendApprovalModal: false,
  deleteFolderModal: false,
  versionConfirmation: false,
  uploadNewVersion: false,
  moveModal: false,
  createFolderModal: false,
  selfApprovalConfirmation: false,
  shareModal: false,

  fileUploadProgress: 0,
  fileFolderToBeRenamed: {},
  fileToNewVersion: [],
  newFileForVersion: [],
  filesToBeSharedArr: [],

  reduxPrepareDeleteArr: [],
  folderToBeDeleted: "",

  arrayForApproval: [],

  filesGoingFor: "",
  versionConfirmationReturns: false,
  allEmptyFiles: [],

  teamMemberArray: [],

  profileData: {},

  notifyMessage: "",

  projectId: "",

  feedbackTempArr: [],
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
    saveOnlyFiles: (state, action) => {
      state.onlyFilesArr = action.payload;
    },
    saveEmptyFolders: (state, action) => {
      state.emptyFolderArr = action.payload;
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
    clearFileCheckbox: (state) => {
      state.fileCheckBoxArr = [];
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

    savePrepareDeleteArr: (state, action) => {
      state.reduxPrepareDeleteArr = [...action.payload];
    },

    saveFolderToBeDeleted: (state, action) => {
      state.folderToBeDeleted = action.payload;
    },

    saveArrayForApproval: (state, action) => {
      let x = state.arrayForApproval.map((curElem) => {
        return curElem.file._id;
      });
      if (!x.includes(action.payload.file._id)) {
        state.arrayForApproval = [...state.arrayForApproval, action.payload];
      } else {
        let y = state.arrayForApproval.filter((curElem) => {
          return curElem.file._id !== action.payload.file._id;
        });
        state.arrayForApproval = [...y];
      }
    },
    clearArrayForApproval: (state) => {
      state.arrayForApproval = [];
    },

    setFilesGoingFor: (state, action) => {
      state.filesGoingFor = action.payload;
    },

    saveFileToNewVersion: (state, action) => {
      let x = state.fileToNewVersion.map((curElem) => {
        return curElem.file._id;
      });
      if (!x.includes(action.payload.file._id)) {
        state.fileToNewVersion = [...state.fileToNewVersion, action.payload];
      } else {
        let y = state.fileToNewVersion.filter((curElem) => {
          return curElem.file._id !== action.payload.file._id;
        });
        state.fileToNewVersion = [...y];
      }
    },
    saveNewFileForVersion: (state, action) => {
      state.newFileForVersion = action.payload;
    },
    cleanNewFileForVersion: (state) => {
      state.newFileForVersion = {};
    },

    setVersionConfirmationReturns: (state, action) => {
      state.versionConfirmationReturns = action.payload;
    },

    saveAllEmptyFiles: (state, action) => {
      state.allEmptyFiles = [action.payload];
    },
    clearAllEmptyFiles: (state) => {
      state.allEmptyFiles = [];
    },

    saveTeamMemberArray: (state, action) => {
      state.teamMemberArray = [...action.payload];
    },

    saveProfileData: (state, action) => {
      state.profileData = action.payload;
    },

    saveFilesToBeShared: (state, action) => {
      state.filesToBeSharedArr = [...action.payload];
    },

    inputNotifyMessage: (state, action) => {
      state.notifyMessage = action.payload;
    },

    selectAllCheckBoxes: (state, action) => {
      state.fileCheckBoxArr = [...action.payload];
    },

    fillFileCheckbox: (state, action) => {
      state.fileCheckBoxArr = [...action.payload];
    },

    addSingleFileToCheckboxArr: (state, action) => {
      state.fileCheckBoxArr = [action.payload];
    },

    saveProjectId: (state, action) => {
      state.projectId = action.payload;
    },

    saveFeedbackTemp: (state, action) => {
      state.feedbackTempArr = action.payload;
    },
    clearFeedbackTempArr: (state) => {
      state.feedbackTempArr = [];
    }
  },
});

export const {
  setLoadingState,
  saveFileAndFolder,
  saveOnlyFiles,
  saveEmptyFolders,
  selectFileTypeTab,
  selectInternalTab,
  selectFileCheckbox,
  clearFileCheckbox,
  handleDetailsVersionBox,
  changeDetVerTab,
  setModalState,
  setFileUploadProgress,
  selectFileFolderToBeRenamed,
  savePrepareDeleteArr,
  saveArrayForApproval,
  saveFolderToBeDeleted,
  clearArrayForApproval,
  setFilesGoingFor,
  saveFileToNewVersion,
  saveNewFileForVersion,
  cleanNewFileForVersion,
  setVersionConfirmationReturns,
  saveAllEmptyFiles,
  clearAllEmptyFiles,
  saveTeamMemberArray,
  saveProfileData,
  saveFilesToBeShared,
  inputNotifyMessage,
  selectAllCheckBoxes,
  fillFileCheckbox,
  addSingleFileToCheckboxArr,
  saveProjectId,
  saveFeedbackTemp,
  clearFeedbackTempArr,
} = filemanagerSlice.actions;

export default filemanagerSlice.reducer;
