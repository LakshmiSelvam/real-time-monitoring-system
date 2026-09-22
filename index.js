import React from "react";
import ReactDOM from "react-dom";
// import ReactDOM from "react-dom/client""
import "./common/Style/style.css";
import RouteSetting from "./RoutSetting";
import { Provider } from "react-redux";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { legacy_createStore as createStore } from "redux";

import reducer from "./redux/reducer";

const root = ReactDOM.createRoot(document.getElementById("root"));
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
  <Provider store={store}>
    <RouteSetting />
  </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
//  *****homelayout,landinglayout,assets,common,redux ,index,logo,RoutSeting,setupTest all are comes under src folder ********


// root.render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <RouteSetting />
//     </PersistGate>
//   </Provider>
// );
