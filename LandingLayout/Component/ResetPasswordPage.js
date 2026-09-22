import "./Styles/ResetPasswordPage.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import InputField from "../../common/component/InputField";
import EyeIcon from "../../assets/svg/eyeIcon.svg";
import EyeCross from "../../assets/svg/eye-cross.svg";
import Logo from "../../../src/assets/images/sitsenz-img.png";
import URL from "../../common/api/constantURL";
import * as API from "../../common/api/index";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/action/userAction";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { primaryAuthToken, secondaryAuthToken } = useParams();

  const [loginForm, setLoginForm] = useState({
    newPassword: localStorage.getItem("newPassword") || "",
    confirmPassword: localStorage.getItem("confirmPassword") || "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [logError, setLogError] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?]).{8,15}$/;

  const [displayText, setDisplayText] = useState("Password has beed Changed!!");
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (showText) {
      const timeoutId = setTimeout(() => {
        setShowText(false);
        navigate("/user/login");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [showText]);

  const handleChange = (name, value) => {
    setErrorMessage("");
    setErrorNewPassword(false);
    setErrorConfirmPassword(false);
    setLogError(false);
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loginForm.newPassword.length === 0) {
      setErrorMessage("Please enter a new password");
      setErrorNewPassword(true);
      return;
    }

    if (loginForm.confirmPassword.length === 0) {
      setErrorMessage("Please enter a confirm password");
      setErrorConfirmPassword(true);
      return;
    }

    if (!passwordRegex.test(loginForm.newPassword)) {
      setErrorMessage(
        "8-15 chars & at least 1 lowercase, 1 upper, 1 digit, 1 special char."
      );
      return setErrorNewPassword(true);
    }

    if (loginForm.newPassword !== loginForm.confirmPassword) {
      setLogError(true);
      setErrorMessage("New password and confirm password do not match");
      return;
    }
    dispatch(setLoading(true));
    fetch(
      "https://demo-apps.sitesenz.com/auth/services/api/v1/profiles/resetPassword",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          primaryAuthToken: primaryAuthToken,
          secondaryAuthToken: secondaryAuthToken,
          password: loginForm.confirmPassword,
        }),
      }
    )
      .then(function (response) {
        if (response.status == 200) {
          setShowText(true);
        } else {
          setErrorMessage("Password does not match the required pattern");
          setLogError(true);
        }
      })
      .then(function (data) {
        console.log("data", data);
      });
    dispatch(setLoading(false));
  };

  return (
    <div className="login-container">
      <div className="left_split_body">
        <div className="left_top_split">
          <div className="flex items-center logo-container">
            <div className="prod_logo">
              <img
                src={Logo}
                alt="logo"
                width="100"
                height="100"
                className="logo-img"
              />
            </div>

            <div className="logo-name-container">
              <div className="logo-name">SiteSenz</div>
              <div className="logo-dev">Accelerating Development</div>
            </div>
          </div>
        </div>
        <div className="left_bottom_split">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="547"
            height="375"
            viewBox="0 0 847 475"
            fill="none"
          >
            <path
              d="M364.344 845.136C364.344 826.404 370.947 810.481 384.154 797.368C397.36 784.255 413.236 777.699 431.781 777.699V501.205C437.026 502.704 442.429 504.015 447.988 505.139C453.547 506.263 459.385 506.825 465.5 506.825C496.971 506.825 523.384 496.147 544.739 474.792C566.094 453.437 576.772 427.024 576.772 395.553V385.438L720.639 420.28C732.627 423.278 743.492 428.523 753.233 436.016C762.974 443.509 770.842 452.5 776.836 462.991L879.117 647.32C890.356 667.551 894.477 688.906 891.48 711.385C888.483 733.865 878.742 753.347 862.257 769.831C842.026 790.063 817.861 800.178 789.762 800.178C761.663 800.178 737.498 790.063 717.267 769.831L499.219 550.659V777.699C517.951 777.699 533.874 784.302 546.987 797.509C560.1 810.715 566.656 826.591 566.656 845.136H364.344ZM15.9167 743.98V676.543H240.708V743.98H15.9167ZM202.494 564.147L0.181252 506.825C-21.5486 500.831 -39.3446 488.654 -53.2068 470.296C-67.0689 451.938 -74 431.145 -74 407.917C-74 379.443 -64.0717 355.278 -44.2151 335.421C-24.3585 315.565 -0.193405 305.637 28.2802 305.637H399.186C384.95 316.127 373.897 329.052 366.03 344.413C358.162 359.774 354.228 376.821 354.228 395.553C354.228 412.787 357.6 428.523 364.344 442.759C371.087 456.996 380.454 469.36 392.443 479.85L274.427 555.155C263.937 561.15 252.51 565.084 240.146 566.957C227.783 568.83 215.232 567.893 202.494 564.147ZM465.633 474.23C443.814 474.23 425.225 466.594 409.864 451.322C394.503 436.049 386.823 417.503 386.823 395.686C386.823 373.868 394.459 355.278 409.731 339.917C425.005 324.556 443.55 316.876 465.367 316.876C487.186 316.876 505.775 324.512 521.136 339.785C536.497 355.058 544.177 373.603 544.177 395.421C544.177 417.239 536.541 435.828 521.269 451.189C505.995 466.55 487.45 474.23 465.633 474.23ZM568.904 352.843C560.662 332.612 547.362 316.127 529.004 303.389C510.646 290.65 489.478 284.281 465.5 284.281C457.258 284.281 449.39 285.031 441.897 286.529C434.404 288.028 427.285 290.276 420.542 293.273V115.688C420.542 102.949 422.977 90.9605 427.847 79.7209C432.718 68.4813 439.649 58.7404 448.641 50.498L602.623 -93.3686C619.857 -109.853 639.901 -119.22 662.755 -121.468C685.609 -123.716 706.776 -118.845 726.258 -106.856C750.236 -91.87 765.784 -70.7022 772.903 -43.3525C780.021 -16.0028 776.087 9.66086 761.101 33.6386L568.904 352.843ZM-74 204.48V137.043H150.792V204.48H-74ZM60.875 24.647V-42.7905H330.625V24.647H60.875Z"
              fill="white"
              fillOpacity="0.11"
            />
          </svg>
        </div>
      </div>
      <div className="right_split_body">
        <div className="right_top_splits">
          <span className="powered-by">Powered by</span>
          <span className="solutions"> MN Engineering Solutions</span>
        </div>
        {!showText ? (
          <div className="right_middle">
            <div className="reset-text">Reset Password</div>
            <div className="input-container">
              {/* New Password Input */}
              <div className="password-container">
                <InputField
                  label="New Password"
                  autoComplete="off"
                  type={showNewPassword ? "text" : "password"}
                  autoFocus
                  name="newPassword"
                  className="input-field"
                  placeHolderType="bold"
                  placeholder="Enter new password"
                  value={loginForm.newPassword}
                  onChange={(event) =>
                    handleChange("newPassword", event.target.value)
                  }
                />
                <img
                  src={showNewPassword ? EyeCross : EyeIcon}
                  className="icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  alt="Toggle Password Visibility"
                />
              </div>
              <span
                data-testid="newPassword-error-field"
                className="error-message"
              >
                {errorNewPassword && errorMessage}
              </span>

              {/* Confirm Password Input */}
              <div className="password-container">
                <InputField
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  minLength="5"
                  maxLength="8"
                  dataTestId="password-field"
                  value={loginForm.confirmPassword}
                  onChange={(event) =>
                    handleChange("confirmPassword", event.target.value)
                  }
                  placeholder="Enter confirm password"
                  className="input-field"
                />
                <img
                  src={showPassword ? EyeCross : EyeIcon}
                  className="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  alt="Toggle Password Visibility"
                />
              </div>
              <span
                data-testid="confirmPassword-error-field"
                className="error-message"
              >
                {errorConfirmPassword && errorMessage}
                {logError && errorMessage}
              </span>
            </div>

            <button className="login-button" onClick={handleSubmit}>
              Submit
            </button>
            <div className="login-message"></div>
          </div>
        ) : (
          <div className="default-text">{displayText}</div>
        )}
        <div className="right_bottom_split">
          <svg
            className="logins_right-side_img"
            xmlns="http://www.w3.org/2000/svg"
            width="226"
            height="234"
            viewBox="0 0 326 234"
            fill="none"
          >
            <path
              d="M169.812 293.139V165.878H159.521C137.565 165.878 116.896 162.515 97.5135 155.788C78.1309 149.061 60.8924 139.52 45.7979 127.165C30.7035 114.809 19.2969 100.532 11.5781 84.3325C3.85938 68.1331 0 51.2474 0 33.6753V0.727478H40.1375C61.4069 0.727478 81.8188 4.0909 101.373 10.8177C120.927 17.5446 138.423 27.0857 153.86 39.4411C165.181 48.7763 174.53 59.2098 181.905 70.7415C189.281 82.2732 194.513 94.4914 197.6 107.396C200.344 104.101 203.26 100.944 206.348 97.9234C209.435 94.9032 212.694 91.883 216.125 88.8628C231.562 76.5074 249.058 66.9662 268.613 60.2394C288.167 53.5126 308.75 50.1492 330.363 50.1492H370.5V83.0969C370.5 100.669 366.383 117.555 358.15 133.754C349.917 149.953 338.253 164.231 323.158 176.586C307.721 188.942 290.311 198.414 270.928 205.004C251.545 211.593 231.219 214.888 209.95 214.888H200.688V293.139H169.812Z"
              fill="white"
              fillOpacity="0.29"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
