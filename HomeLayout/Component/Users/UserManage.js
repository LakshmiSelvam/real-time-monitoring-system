import { useState } from "react";
import UserRolesList from "../Roles/RolesList.js";
import UsersList from "./UsersList.js";
import "../../Style/Users.css";

function Manage() {
  const [userActive, setUserActive] = useState(true);
  const [roleActive, setRoleActive] = useState(false);
  return (
    <div className="user-menues">
      <div className="titles">
        <div
          className={
            userActive ? "user-management-active" : "user-management-title"
          }
          onClick={() => {
            setUserActive(true);
            setRoleActive(false);
          }}
        >
          Users
        </div>
        <div
          className={
            roleActive ? "role-management-active" : "role-management-title"
          }
          onClick={() => {
            setRoleActive(true);
            setUserActive(false);
          }}
        >
          Roles
        </div>
      </div>
      <div className="">{userActive ? <UsersList /> : <UserRolesList />}</div>
    </div>
  );
}
export default Manage;
