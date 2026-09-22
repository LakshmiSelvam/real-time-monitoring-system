import { createStore } from "redux";
import reducers from "./reducer/index";

const store = createStore(
  reducers,
  {},
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { userReducer } from "./reducer/userReducer";

// const store = configureStore({
//   reducer: {
//     reducer: userReducer,
//   },
// });

// export default store;
