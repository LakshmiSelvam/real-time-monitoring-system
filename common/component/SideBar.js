import Dashboard from "../../HomeLayout/Component/DashBoard";
import Account from "../../HomeLayout/Component/AccountSetting";
import Report from "../../HomeLayout/Component/Report/SelectReport";
export const SidebarData = [
  {
    id: 1,
    title: "Dashboard",
    path: "/home/dashboard",
    navpath: "/dashboard",
    component: <Dashboard />,
    cName: "nav-text",
    refName: ["VIEW_DASHBOARD", "VIEW_PROFILE"],
    roles: [1, 2, 3, 4, 5],
    dataTestId: "dashboard-nav",
  },
  {
    id: 2,
    title: "Account",
    component: <Account />,
    navpath: "/account",
    path: "/home/account",
    roles: [3, 4, 5],
    refName: ["VIEW_PROFILE"],
    dataTestId: "profile-nav",
  },
  {
    id: 3,
    title: "Report",
    component: <Report />,
    navpath: "/report",
    path: "/home/report",
    roles: [3, 4, 5],
    refName: ["VIEW_PROFILE"],
    dataTestId: "profile-nav",
  },
];
