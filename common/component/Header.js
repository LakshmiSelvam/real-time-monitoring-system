import Overview from "../../assets/images/overview.png";
import "../Style/Header.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../common/component/Navbar";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import blankProfile from "../../assets/images/blankUserProfile.png";
import * as API from "../../common/api/index";
import URL from "../../common/api/constantURL.js";
import HMI from "../../assets/images/HMI.jpeg";
import {
  setLoading,
  setBaseUrl,
  setLoggedUser,
} from "../../redux/action/userAction.js";

function Header({ title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();
  const [showPopUp, setShowPopUp] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const users = useSelector((state) => state.userReducer.users);
  const userData = useSelector((state) => state.userReducer.loggedUser);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowPopUp(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // useEffect(() => {
  //   const authToken = localStorage.getItem("authToken");
  //   if (authToken) {
  //     const decodedToken = jwtDecode(authToken);
  //     fetchUser(decodedToken.user.userId)
  //   }
  // }, [userData]);

  const fetchUser = async (userId) => {
    const result = await API.getAPI(URL.getUserById + userId);
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    } else {
      if (result.result.message === "success") {
        dispatch(setLoggedUser(result.result.data));
        localStorage.setItem("companyCode", result.result.data.companyCode);
      } else {
        dispatch(setLoading(false));
      }
    }
  };

  const SignOutButtonHandler = (event) => {
    event.preventDefault();
    localStorage.clear();
    localStorage.removeItem("authToken");
    localStorage.removeItem("refToken");
    localStorage.removeItem("ack");
    localStorage.removeItem("plantId");
    localStorage.removeItem("companyCode");
    localStorage.removeItem("persist:root");
    navigate("/user/login");
    // window.location.href = "/user/login";
  };
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navigateHMI = () => {
    window.open("https://demo-apps.sitesenz.com/hmi/", "_blank");
  };

  return (
    <div className="header-container">
      <div className="header-inner-container">
        <div className="menu-icon" onClick={toggleNav}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {isOpen ? (
          <div className="nav-menu">
            <Navbar isOpen={isOpen} closeNav={toggleNav} />
          </div>
        ) : (
          ""
        )}
        {/* <div className="nav-menu">
          <div className={`sidenav ${navOpen ? "open" : ""}`}>
            <div className="close-btn" onClick={() => setNavOpen(false)}>
              &times;
            </div>
            <Navbar />
          </div>
        </div> */}
        <div className="title-container">
          <div className="header-img">
            <img src={Overview} alt="overview" />
          </div>
          <div className="header-title">{title}</div>
        </div>
        <div className="headers-img rounded">
          <img
            className="HMI-img"
            src={HMI}
            alt="header"
            onClick={navigateHMI}
          />
        </div>
        <div className="profile-container">
          <img
            src={userData.profileUrl ? userData.profileUrl : blankProfile}
            alt="profile_img"
            className="profile_img"
          />

          <div className="profile-name">
            {userData.firstName} {userData.lastName}
          </div>
          <div
            className="sign-out-btn"
            onClick={() => setShowPopUp(!showPopUp)}
          ></div>
        </div>
      </div>
      {showPopUp && (
        <div
          className="header-pop-up-ctr"
          data-testid="sign-out-popup"
          ref={ref}
        >
          <div
            className="profile-header-ctr"
            onClick={() => {
              navigate("/home/account");
              setShowPopUp(false);
            }}
            data-testid="profile-nav"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="IconChangeColor"
              height="30"
              width="30"
              className="header-account-img"
            >
              <path
                class="cls-2"
                d="M12.94,22H11.05a1.68,1.68,0,0,1-1.68-1.68V19.23a.34.34,0,0,0-.22-.29.38.38,0,0,0-.41,0L8,19.74a1.67,1.67,0,0,1-2.37,0L4.26,18.4a1.66,1.66,0,0,1-.5-1.19A1.72,1.72,0,0,1,4.26,16L5,15.26a.34.34,0,0,0,0-.37c-.06-.15-.16-.26-.3-.26H3.68A1.69,1.69,0,0,1,2,12.94V11.05A1.68,1.68,0,0,1,3.68,9.37H4.77a.34.34,0,0,0,.29-.22.38.38,0,0,0,0-.41L4.26,8a1.67,1.67,0,0,1,0-2.37L5.6,4.26a1.65,1.65,0,0,1,1.18-.5h0A1.72,1.72,0,0,1,8,4.26L8.74,5a.34.34,0,0,0,.37,0c.15-.06.26-.16.26-.3V3.68A1.69,1.69,0,0,1,11.06,2H13a1.68,1.68,0,0,1,1.68,1.68V4.77a.34.34,0,0,0,.22.29.38.38,0,0,0,.41,0L16,4.26a1.67,1.67,0,0,1,2.37,0L19.74,5.6a1.67,1.67,0,0,1,.5,1.19A1.63,1.63,0,0,1,19.74,8L19,8.74a.34.34,0,0,0,0,.37c.06.15.16.26.3.26h1.09A1.69,1.69,0,0,1,22,11.06V13a1.68,1.68,0,0,1-1.68,1.68H19.23a.34.34,0,0,0-.29.22v0a.34.34,0,0,0,0,.37l.77.77a1.67,1.67,0,0,1,0,2.37L18.4,19.74a1.65,1.65,0,0,1-1.18.5h0a1.72,1.72,0,0,1-1.19-.5L15.26,19a.34.34,0,0,0-.37,0c-.15.06-.26.16-.26.3v1.09A1.69,1.69,0,0,1,12.94,22Zm-1.57-2h1.26v-.77a2.33,2.33,0,0,1,1.46-2.14,2.36,2.36,0,0,1,2.59.47l.54.54.88-.88-.54-.55a2.34,2.34,0,0,1-.48-2.56h0v0a2.33,2.33,0,0,1,2.14-1.45H20V11.37h-.77a2.33,2.33,0,0,1-2.14-1.46,2.36,2.36,0,0,1,.47-2.59l.54-.54-.88-.88-.55.54a2.39,2.39,0,0,1-4-1.67V4H11.37v.77A2.33,2.33,0,0,1,9.91,6.91a2.36,2.36,0,0,1-2.59-.47L6.78,5.9l-.88.88.54.55a2.39,2.39,0,0,1-1.67,4H4v1.26h.77a2.33,2.33,0,0,1,2.14,1.46,2.36,2.36,0,0,1-.47,2.59l-.54.54.88.88.55-.54a2.39,2.39,0,0,1,4,1.67Z"
                id="mainIconPathAttribute"
                fill="#03989e"
              ></path>
              <path
                class="cls-2"
                d="M12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Zm0-5A1.5,1.5,0,1,0,13.5,12,1.5,1.5,0,0,0,12,10.5Z"
                id="mainIconPathAttribute"
                fill="#03989e"
              ></path>
            </svg>
            <div className="header-account-popup">Account Setting</div>
          </div>
          <div
            className="signout-header-ctr"
            data-testid="header-sign-out-btn"
            onClick={SignOutButtonHandler}
          >
            <svg
              className="svg-icon"
              width="30"
              height="30"
              vertical-align="middle"
              fill="var(--color2)"
              overflow="hidden"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M768.8 702.2c-8 0-16-3.2-22.4-9.6-12.8-12.8-12.8-32 0-44.7l137.4-137.4-137.3-137.4c-12.8-12.8-12.8-32 0-44.7s32-12.8 44.7 0L951 488.1c12.8 12.8 12.8 32 0 44.7L791.2 692.6c-6.4 6.4-14.4 9.6-22.4 9.6zM321.5 510.5c0-17.6 14.4-32 32-32h559.2c17.6 0 32 14.4 32 32s-14.4 32-32 32H353.5c-17.6-0.1-32-14.4-32-32zM65.9 830V191c0-52.7 43.1-95.9 95.9-95.9h351.5c52.7 0 95.9 43.1 95.9 95.9v127.8c0 17.6-14.4 32-32 32s-32-14.4-32-32V191c0-17.6-14.4-32-32-32H161.7c-17.6 0-32 14.4-32 32v639c0 17.6 14.4 32 32 32h351.5c17.6 0 32-14.4 32-32V702.2c0-17.6 14.4-32 32-32s32 14.4 32 32V830c0 52.7-43.1 95.9-95.9 95.9H161.7c-52.7 0-95.8-43.1-95.8-95.9z" />
            </svg>

            <div className="logout-btn" onClick={SignOutButtonHandler}>
              Sign Out
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Header;
