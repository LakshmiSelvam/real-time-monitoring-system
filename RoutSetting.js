import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingLayout from "./LandingLayout/LandingLayout";
import HomeLayout from "./HomeLayout/HomeLayout";
import PageNotFound from "./common/component/PageNotFound";
import { HashRouter } from "react-router-dom";
import { createHashHistory } from 'history';

const history = createHashHistory();
function RouteSetting() {
  return (
    <HashRouter history={history}>
      <Routes>
        <Route path="/" exact element={<Navigate replace to="/user/login" />} />
        <Route path="/user/*" exact element={<LandingLayout />} />
        <Route path="/home/*" exact element={<HomeLayout />} />
        <Route path="/:PageName" exact  element={<PageNotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default RouteSetting;
