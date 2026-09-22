import ButtonField from "../../../common/component/ButtonField";
import "../../Style/Users.css";
import Table from "../../../common/component/Table";
import { useState, useEffect, useRef } from "react";
import AddUser from "./AddUser";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/action/userAction";
import Model from "../../../common/component/Model";
import { setSnackData } from "../../../redux/action/userAction";
import PlusIcon from "../../../assets/svg/plus_icon.svg";
import URL from "../../../common/api/constantURL";
import * as API from "../../../common/api/index.js";
import { setLoading } from "../../../redux/action/userAction";

function UsersList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userReducer.users);
  const [showActivateDeactivatePopup, setShowActivateDeactivatePopup] =
    useState(false);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [activeStatus, setActiveStatus] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // to track the user to activate/deactivate

  var [ErrorMessage, setErrorMessage] = useState("");
  var [ErroUser, setErrorUser] = useState(false);
  // console.log("users", users);

  const toggleActivateDeactivate = (data) => {
    setSelectedUserId(data.userId);
    if (data.isDeactivated == "Active") {
      setActiveStatus(true);
    } else {
      setActiveStatus(false);
    }
    setShowActivateDeactivatePopup(true);
  };

  useEffect(() => {
    fetchUser();
  }, [showAddUserPopup]);

  const fetchUser = async () => {
    let companyCode = localStorage.getItem("companyCode");
    let result = await API.getAPI(URL.getAllUser + companyCode);
    dispatch(setLoading(false));
    // console.log("API data", result);
    if (result.fetchStatus === "failure") {
      setErrorMessage("Server down.Failed to fetch");
      return setErrorUser(true);
    } else {
      if (result.result.message === "success") {
        // console.log("result", result);
        const usersList = result.result.data.map((user) => {
          if (user.isDeactivated === false) {
            user.isDeactivated = "Active";
          } else {
            user.isDeactivated = "Inactive";
          }
          return user;
        });

        dispatch(setUser(usersList));
      } else {
        setErrorMessage(result.result.message);
        return setErrorUser(true);
      }
    }
  };

  const editUserDetails = async (data, page, perPage) => {
    const result = await API.getAPI(URL.getUserById + data.userId);
    dispatch(setLoading(false));
    // console.log("user resu;lt", result);
    if (result.fetchStatus === "failure") {
      setErrorMessage("Server down.Failed to fetch");
      return setErrorUser(true);
    } else {
      if (result.result.message === "success") {
        // dispatch(setUser(result.result.data));
      } else {
        setErrorMessage(result.result.message);
        return setErrorUser(true);
      }
    }

    navigate(`/home/users/edit-user/${data.userId}`);
    setShowAddUserPopup(true);
  };

  const handleToggleOk = async () => {
    let result;
    let data = {
      userId: selectedUserId,
    };
    // console.log("user id selected", data);
    if (activeStatus) {
      // console.log("*Deactivate**********");
      result = await API.patchAPI(URL.deActivateUser, data);
    } else {
      // console.log("activated@@@q");
      result = await API.patchAPI(URL.activateUser, data);
    }
    if (result.fetchStatus === "failure") {
      // console.log("result", result);
      setErrorMessage("Server down. Failed to fetch");
      setErrorUser(true);
    } else {
      fetchUser(); // refetch the user

      let snackData = {
        showSnack: true,
        snackMessage: activeStatus
          ? "User Deactivated Successfully"
          : "User Activated Successfully",
        snackVariant: "success",
      };
      dispatch(setSnackData(snackData));
      setShowActivateDeactivatePopup(false);
    }
  };

  return (
    <div className="user-container">
      <div className="user-inner-container">
        <div className="add-user-button-container">
          <ButtonField
            label="Add New User "
            img={PlusIcon}
            className="add-user-button"
            onClick={() => setShowAddUserPopup(true)}
          />
        </div>
        <div className="users-list-container">
          <Table
            headers={[
              {
                id: "firstName",
                label: "First Name",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "firstname",
              },
              {
                id: "lastName",
                label: "Last Name",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "lastname",
              },
              {
                id: "profileUrl",
                label: "Profile",
                type: "image",
                width: 50,
                responsive: true,
                dataTestid: "profile-picture",
              },
              {
                id: "userRole",
                label: "Role",
                width: 50,
                responsive: true,
                sortable: false,
                dataTestid: "role",
              },
              {
                id: "mobile",
                label: "Phone Number",
                width: 90,
                sortable: false,
                dataTestid: "countryCode",
              },
              {
                id: "email",
                label: "Email",
                width: 100,
                sortable: false,
                dataTestid: "email",
              },
              {
                id: "companyCode",
                label: "Company Code",
                width: 80,
                responsive: true,
                // sortable: true,
                dataTestid: "companycode",
              },
              {
                id: "isDeactivated",
                label: "Status",
                type: "alarmButton",
                width: 100,
                responsive: true,
                justifyContent: "center",
              },
              {
                id: "manage",
                label: "MANAGE",
                type: "manage",
                type: "action",
                path: "2",
                width: 70,
                responsive: true,
              },
            ]}
            tableTitle={"Total Users"}
            showPageEntryContainer={false}
            data={users}
            defaultOrderBy={"accountName"}
            defaultSortOrder={"asc"}
            userManage={true}
            editAction={(data) => {
              editUserDetails(data);
            }}
            deleteAction={(data) => toggleActivateDeactivate(data)}
          />
        </div>
      </div>
      {showAddUserPopup ? (
        <AddUser setShowAddUserPopup={setShowAddUserPopup} />
      ) : (
        ""
      )}
      {showActivateDeactivatePopup ? (
        <Model
          disableCancel={false}
          onCancel={() => setShowActivateDeactivatePopup(false)}
          onOk={handleToggleOk}
          show={showActivateDeactivatePopup}
          content={`Are you sure you want to ${
            activeStatus ? "deactivate" : "activate"
          } this user?`}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default UsersList;
