import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./Component/LoginPage";
import ForgotPasswordPage from "./Component/ForgotPasswordPage";
import ResetPasswordPage from "./Component/ResetPasswordPage";
import Loader from "../common/component/Loader";
import { useSelector } from "react-redux";

function LandingLayout() {
  const isLoading = useSelector((state) => state.userReducer.loading);
  return (
    <React.Fragment>
      <div className="container">
        {isLoading && <Loader />}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Navigate replace to="/user/login" />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route
              path="/reset-password/:primaryAuthToken/:secondaryAuthToken"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LandingLayout;
