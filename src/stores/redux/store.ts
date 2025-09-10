import toolkit from "@reduxjs/toolkit";

const { configureStore, createAction, createReducer } = toolkit;

const initialState = {
  user: [],
};

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(createAction("user/fetchUser"), (state, action) => {
    state.user = action.payload;
  });
});
