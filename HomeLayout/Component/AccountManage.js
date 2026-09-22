import { useState } from "react";
import "../Style/AccountSetting.css";
import Account from "./AccountSetting";
import ListFactory from "./FactoryManage/ListFactoryDays";

function AccountManage() {
  const [profileActive, setProfileActive] = useState(true);
  const [factoryActive, setFactoryActive] = useState(false);
  const [listFactoryActive, setListFactoryActive] = useState(false);
  return (
    <div className="account-menues">
      <div className="account-title">
        <div
          className={profileActive ? "profile-title-active" : "profile-title"}
          onClick={() => {
            setListFactoryActive(false);
            setProfileActive(true);
          }}
        >
          My Profile
        </div>
        <div
          className={
            listFactoryActive
              ? "factory-management-active"
              : "factory-management-title"
          }
          onClick={() => {
            setListFactoryActive(true);
            setProfileActive(false);
          }}
        >
          Shifts Plan
        </div>
      </div>
      <div className="">
        {profileActive ? <Account /> : null}
        {listFactoryActive ? <ListFactory /> : null}
      </div>
    </div>
  );
}
export default AccountManage;
