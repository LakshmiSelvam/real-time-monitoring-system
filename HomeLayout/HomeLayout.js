import NavBar from "../common/component/Navbar";
import "./Style/HomeLayout.css";
import Header from "../common/component/Header";

import { SidebarData } from "../common/component/SideBar";
import { validateSidebar } from "../common/functions/permissionFunctions";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashBoard from "./Component/DashBoard";
import LiveReport from "../HomeLayout/Component/LiveReportsLayout/LiveReport";
import { useLocation } from "react-router-dom";
import Account from "./Component/AccountSetting";
import Report from "./Component/Report/NewSelectReports";
import Users from "./Component/Users/UsersList";
import Roles from "./Component/Roles/RolesList";
import Snack from "../common/component/SnackBar";
import ManagePlants from "./Component/Plants/ManagePlants";
import LiveReportStatus from "./Component/LiveReportsLayout/LiveReportStatus";
import Manage from "./Component/Users/UserManage";
import AccountManage from "./Component/AccountManage";
import Factory from "./Component/FactoryManage/FactoryDetails";
import FactoryDetails from "./Component/FactoryManage/FactoryDetails";

import AddFactory from "./Component/FactoryManage/AddFactoryDetails";

function HomeLayout() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/user/login");
    }
  }, []);

  useEffect(() => {
    if ( window.location.hash === "#/home/dashboard") {
      setTitle("Overview");
    } else if ( window.location.hash === "#/home/report") {
      setTitle("Reports");
    } else if ( window.location.hash === "#/home/account") {
      setTitle("Account Settings");
    } else if ( window.location.hash === "#/home/live-report") {
      setTitle("Live Machine - Report");
    }
   else if( window.location.hash === "#/home/users") {
    setTitle("Users & Roles");
  }
  else if ( window.location.hash === "#/home/plants") {
    setTitle("Plant Details");
  }
  }, [window.location.hash]);
  return (
    <div className="home-layout">
      <div className="nav-bar">
        <NavBar />
      </div>
      <div className="dashboard">
        <div className="dashboard-container">
          <Header title={title} isOpen={false} closeNav={false} />
          <Snack />
        </div>
        <div className="content-container">
          <Routes>
            <Route exact path="/Dashboard" element={<DashBoard />}></Route>

            <Route exact path="/account" element={<AccountManage />}></Route>
            <Route exact path="/report" element={<Report />}></Route>

            <Route exact path="/live-report" element={<LiveReport />}></Route>

            <Route exact path="/users" element={<Manage />}></Route>

            <Route exact path="/roles" element={<Manage />}></Route>
            <Route exact path="/plants" element={<ManagePlants />}></Route>
            <Route
              exact
              path="/live-report/:machineId"
              element={<LiveReportStatus />}
            ></Route>
            {/* <Route
              exact
              path="/live-report/:machineId"
              element={<LiveReportStatus />}
            ></Route> */}
            <Route
              exact
              path="/users/edit-user/:userId"
              element={<Manage />}
            ></Route>
            <Route
              exact
              path="/roles/edit-role/:roleId"
              element={<Manage />}
            ></Route>
            <Route
              exact
              path="/plants/edit-plant/:plantId"
              element={<ManagePlants />}
            ></Route>
            <Route
              exact
              path="/plants/edit-product/:productId"
              element={<ManagePlants />}
            ></Route>
            <Route
              exact
              path="/plants/edit-line/:lineId"
              element={<ManagePlants />}
            ></Route>
            <Route
              exact
              path="/plants/edit-machine/:machineId"
              element={<ManagePlants />}
            ></Route>
            <Route
              exact
              path="/edit-factory/:id"
              element={<FactoryDetails />}
            ></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default HomeLayout;
