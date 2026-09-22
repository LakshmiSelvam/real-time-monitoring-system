import "../Style/NavBar.css";
import Logo from "../../assets/images/sitsenz-img.png";
import Home from "../../assets/svg/home.svg";
import Home_1 from "../../assets/svg/home_1.svg";
import Users from "../../assets/svg/users.svg";
import Users_1 from "../../assets/svg/users_1.svg";
import Roles from "../../assets/svg/roles.svg";
import Roles_1 from "../../assets/svg/roles_1.svg";
import Report from "../../assets/svg/reports.svg";
import Report_1 from "../../assets/svg/reports_1.svg";
import { NavLink, useLocation } from "react-router-dom";

const NavgationBar = ({ isOpen, closeNav }) => {
  const location = useLocation();
  const userPermissions = [
    "dashboard:view",
    "dashboard:edit",
    "report:view",
    "users:view",
    "users:edit",
    "roles:view",
  ];
  const hasPermission = (permission) => userPermissions.includes(permission);

  return (
    <div className={`${isOpen ? " sidenav  open" : "sidebar"}`}>
      <button className="close-btn" onClick={closeNav}>
        &times;
      </button>
      <ul>
        <li>
          <img className="our-logo" src={Logo} alt="not found" />
        </li>
        {hasPermission("dashboard:view") && (
          <li>
            <NavLink
              to="/home/dashboard"
              className="sidebar-menu-item-link"
              onClick={closeNav}
              isActive={(match, location) => {
                return location.pathname === "/home/dashboard";
              }}
            >
              <img
                src={location.pathname === "/home/dashboard" ? Home_1 : Home}
                className="home-logo"
                title="Home"
              />
            </NavLink>
          </li>
        )}

        {hasPermission("users:view") && (
          <li>
            <NavLink
              to="/home/users"
              className="sidebar-menu-item-link"
              onClick={closeNav}
              isActive={(match, location) => {
                return location.pathname === "/home/users";
              }}
            >
              <img
                src={location.pathname === "/home/users" ? Users_1 : Users}
                className="user-icon"
                title="Users"
              />
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/home/plants"
            className="sidebar-menu-item-link"
            onClick={closeNav}
            isActive={(match, location) => {
              return location.pathname === "/home/plants";
            }}
          >
            <img
              src={location.pathname === "/home/plants" ? Roles_1 : Roles}
              className="user-icon"
              title="Plants"
            />
          </NavLink>
        </li>
        {hasPermission("report:view") && (
          <li>
            <NavLink
              to="/home/report"
              className="sidebar-menu-item-link"
              onClick={closeNav}
              isActive={(match, location) => {
                return location.pathname === "/home/report";
              }}
            >
              <img
                src={location.pathname === "/home/report" ? Report_1 : Report}
                className="report-logo"
                title="Reports"
              />
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};
export default NavgationBar;
