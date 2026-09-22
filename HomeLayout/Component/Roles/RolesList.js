import { useState, useEffect, useRef } from "react";
import "../../Style/UserRoles.css";
import Table from "../../../common/component/Table";
import ButtonField from "../../../common/component/ButtonField";
import AddRole from "./AddRole";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/action/userAction";
import { setSnackData } from "../../../redux/action/userAction";
import Model from "../../../common/component/Model";
import PlusIcon from "../../../assets/svg/plus_icon.svg";

function UserRolesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const users = useSelector((state) => state.userReducer.users);
  const [showAddRolePopup, setShowAddRolePopup] = useState(false);
  // console.log("user", users);

  useEffect(() => {
    fetchUser();
  }, []);

  const roleslist = [
    {
      id: 1,
      "Role Name": "Developer",
    },
    {
      id: 2,
      "Role Name": "Engineer",
    },
    {
      id: 3,
      "Role Name": "System Design",
    },
  ];
  const fetchUser = () => {
    dispatch(setUser(roleslist));
  };

  const editRoleDetails = (data, page, perPage) => {
    navigate(`/home/roles/edit-role/${data.id}`);
    setShowAddRolePopup({ isOpen: true, roleData: data });
  };
  const showDeleteAction = (data) => {
    setShowDeletePopup({ isOpen: true, data: data });
  };
  const handleOk = () => {
    let snackData = {
      showSnack: true,
      snackMessage: "Role Deleted Succesfully",
      snackVariant: "success",
    };
    dispatch(setSnackData(snackData));
    setShowDeletePopup(false);
    navigate("/home/roles");
  };

  return (
    <div className="roles-container">
      <div className="role-inner-container">
        <div className="add-role-button-container">
          <ButtonField
            label="Add New Role "
            img={PlusIcon}
            className="add-role-button"
            onClick={() => setShowAddRolePopup(true)}
          />
        </div>
        <div className="roles-list-container">
          <Table
            headers={[
              {
                id: "Role Name",
                label: "Role Name",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "firstname",
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
            tableTitle={"Total Roles"}
            data={users}
            showPageEntryContainer={false}
            defaultOrderBy={"accountName"}
            defaultSortOrder={"asc"}
            editAction={(data) => {
              editRoleDetails(data);
            }}
            deleteAction={(data) => showDeleteAction(data)}
          />
        </div>
      </div>
      {showAddRolePopup ? (
        <AddRole
          setShowAddRolePopup={setShowAddRolePopup}
          roleData={showAddRolePopup.roleData}
        />
      ) : (
        ""
      )}
      {showDeletePopup ? (
        <Model
          disableCancel={false}
          onCancel={() => setShowDeletePopup(false)}
          onOk={handleOk}
          show={showDeletePopup}
          content={"Are you sure want to delete  !!!"}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default UserRolesList;
