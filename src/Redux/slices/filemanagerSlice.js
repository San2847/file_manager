import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  termsType: "all",
};

export const filemanagerSlice = createSlice({
  name: "filemanagerSlice",
  initialState,
  reducers: {
    selectTermsType: (state, action) => {
      state.termsType = `${action.payload}`;
    },
  },
});

export const { selectTermsType } = filemanagerSlice.actions;

export default filemanagerSlice.reducer;
