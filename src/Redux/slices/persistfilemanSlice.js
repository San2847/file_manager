import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  termsType: "all",
};

export const persistfileman = createSlice({
  name: "persistfileman",
  initialState,
  reducers: {
    selectTermsType: (state, action) => {
      state.termsType = `${action.payload}`;
    },
  },
});

export const { selectTermsType } = persistfileman.actions;

export default persistfileman.reducer;
