import "../Style/AccountSetting.css";
import "../Style/Factory.css";
import "../../common/component/InputField";
import { useState, useEffect, useRef } from "react";
import InputField from "../../common/component/InputField";
import ButtonField from "../../common/component/ButtonField";
import Model from "../../common/component/Model";
import { useNavigate } from "react-router-dom";
import * as API from "../../common/api/index.js";
import URL from "../../common/api/constantURL";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import "../../common/Style/TimePicker.css";
import {setLoggedUser, setSnackData} from "../../redux/action/userAction.js"
function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [model, setModel] = useState(false);
  const [userData, setUserData] = useState([]);
  const baseURL = useSelector((state) => state.userReducer.baseURL);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    let decodedToken;
    if (authToken) {
      decodedToken = jwtDecode(authToken);
    }
    getUserById(decodedToken.user.userId);
  }, []);

  const handleCancel = () => {
    setModel(false);
  };

  const handleOk = async() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      const userId = decodedToken.user.userId;

      const updateData = {
        userId: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mobile: userData.mobile,
      };

      const result = await API.patchAPI(URL.updateUser, updateData);
      console.log('example',result)
      if (result.fetchStatus === 'success') {
        let snackData = {
          showSnack: true,
          snackMessage: "User Updated Succesfully ",
          snackVariant: "success",
        };
        dispatch(setSnackData(snackData));
        getUserById(userId)
       
      } else {
        let snackData = {
          showSnack: true,
          snackMessage: "Something Went Wrong!",
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
   
    }
    setModel(false);
   
  };

  const getUserById = async (userId) => {
    const result = await API.getAPI(URL.getUserById + userId);
    if (result.fetchStatus === "success") {
      const user = result.result.data;
      dispatch(setLoggedUser(user))
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        bio: user.bio || "",
      });
    } else {
      console.error("Error fetching user data:", result.message);
    }
  };
  const handleInputChange = (field, value) => {
    setUserData((prevUserData) => ({ ...prevUserData, [field]: value }));
  };

  return (
    <div className="account-container">
      <div className="account-inner-container">
        <div className="profile-content">
          <div className="profile-content-inputfield">
            <InputField
              label="First Name"
              type="text"
              autoFocus={true}
              name="firstname"
              className="input-field"
              placeHolderType="bold"
              placeholder="Enter your firstname"
              autoComplete="off"
              value={userData.firstName}
              onChange={(event) =>
                handleInputChange("firstName", event.target.value)
              }
            />
            <InputField
              label="Email"
              type="text"
              autoFocus={true}
              name="email"
              className="input-field "
              placeHolderType="bold"
              placeholder="Enter your email"
              autoComplete="off"
              value={userData.email}
              onChange={(event) =>
                handleInputChange("email", event.target.value)
              }
              // restrict to edit the email
              disabled={true}
            />
          </div>
          <div className="profile-content-inputfield">
            <InputField
              label="Last Name"
              type="text"
              autoFocus={true}
              name="lastname"
              className="input-field"
              placeHolderType="bold"
              placeholder="Enter your lastname"
              autoComplete="off"
              value={userData.lastName}
              onChange={(event) =>
                handleInputChange("lastName", event.target.value)
              }
            />
            <InputField
              label="Phone Number"
              type="text"
              name="mobile"
              className="input-field"
              placeHolderType="bold"
              placeholder="Enter your mobile number"
              autoComplete="off"
              value={userData.mobile}
              onChange={(event) =>
                handleInputChange("mobile", event.target.value)
              }
            />
          </div>
        </div>

        <div className="profile-content-bio">
          <div className="bio-text">Bio</div>
          <textarea
            className="bio-textarea"
            placeholder="Type something here......"
            value={userData.bio}
            onChange={(event) => handleInputChange("bio", event.target.value)}
          ></textarea>
        </div>
        <ButtonField
          className="account-btn"
          label="Update Profile"
          onClick={() => {
            setModel(!model);
          }}
        />
      </div>
      {model && (
        <Model
          disableCancel={false}
          onCancel={handleCancel}
          onOk={handleOk}
          show={model}
          content="Are you sure wanted to update the profile !"
        />
      )}
    </div>
  );
}
export default Account;
