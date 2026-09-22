import Table from "../../../common/component/Table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFactory } from "../../../redux/action/userAction";
import { useEffect, useState, useRef } from "react";
import { setLoading } from "../../../redux/action/userAction.js";
import * as API from "../../../common/api/index.js";
import { setSnackData } from "../../../redux/action/userAction.js";
import "../../Style/ListFactory.css";
import PlusIcon from "../../../assets/svg/plus_icon.svg";
import AddFactory from "./AddFactoryDetails.js";
import ButtonField from "../../../common/component/ButtonField";
import { Button } from "antd";
import Model from "../../../common/component/Model";

function ListFactory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const factory = useSelector((state) => state.userReducer.factory);
  const plantList = useSelector((state) => state.userReducer.plantList);

  const [showAddFactoryPopup, setShowAddFactoryPopup] = useState(false);
  const [showDeletePopUP, setShowDeletePopUp] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectId, setSelectedId] = useState(null);
  const timezone = localStorage.getItem("timeZone");
  console.log("factory,.,,...", factory);
  useEffect(() => {
    getFactoryDetails();
  }, []);
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return {
      formattedDate: dateTime.toLocaleDateString(),
      formattedTime: dateTime.toLocaleTimeString(),
    };
  };
  // factory.map((d) => console.log(d));
  const formatFactoryData = (item) => {
    const formattedStart = formatDateTime(item.factoryDayStart);
    const formattedEnd = formatDateTime(item.factoryDayEnd);
    const numOfShifts = item.shifts.length;

    const plant = plantList.find((plant) => plant.plantId === item.plantId);
    const plantName = plant ? plant.plantName : "";

    return {
      ...item,
      plantName: plantName,
      startDate: formattedStart.formattedDate,
      startTime: formattedStart.formattedTime,
      endDate: formattedEnd.formattedDate,
      endTime: formattedEnd.formattedTime,
      numOfShifts: numOfShifts,
    };
  };

  // getting all factory details into the table
  const getFactoryDetails = async () => {
    let result = await API.getAPI(
      "https://demo-apps.sitesenz.com/api/dev/api/v1/erp/get"
    );

    dispatch(setLoading(false));
    // console.log("result, result", result);
    if (result.fetchStatus === "success") {
      // let snackData = {
      //   showSnack: true,
      //   // snackMessage: result.message,

      //   snackVariant: "success",
      // };
      // dispatch(setSnackData(snackData));
      dispatch(setLoading(false));
      dispatch(setFactory(result.result.data));
    } else {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
      dispatch(setLoading(false));
    }
  };

  const editFactoryDays = async (data) => {
    navigate(`/home/edit-factory/${data.id}`);
    localStorage.setItem("erpIsEdit", true);
    localStorage.setItem("erpIsView", false);
    setIsEdit(true);
  };

  const viewFactoryDays = async (data) => {
    navigate(`/home/edit-factory/${data.id}`);
    localStorage.setItem("erpIsEdit", false);
    localStorage.setItem("erpIsView", true);
    setIsEdit(false);
  };

  // delete factory data based on the id
  const deleteFactory = async () => {
    if (selectId) {
      const result = await API.deleteAPI(
        `https://demo-apps.sitesenz.com/api/services/api/v1/erp/delete/${selectId}`
      );
      dispatch(setLoading(true));

      if (result.fetchStatus === "failure") {
        let snackData = {
          showSnack: true,
          snackMessage: "Something Went Wrong. Contact Admin!!",
          snackVariant: "success",
        };
        dispatch(setSnackData(snackData));
        dispatch(setLoading(false));
      } else {
        if (result.result.message === "success") {
          dispatch(setLoading(false));
          let snackData = {
            showSnack: true,
            // snackMessage: result.result.message,
            snackMessage: "Shift Deleted sucessfully",
            snackVariant: "success",
          };
          dispatch(setSnackData(snackData));
          setShowDeletePopUp(false);
          navigate("/home/account");
          getFactoryDetails(); // Refresh factory data after deletion
        } else {
          let snackData = {
            showSnack: true,
            snackMessage: result.message,
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));
        }
      }
    }
  };

  // Binding delete action to delete button
  const showFactoryDeleteAction = async (data) => {
    setSelectedId(data.id);
    setShowDeletePopUp(true);
  };
  // console.log(factory);
  return (
    <div className="factory-container">
      <div className="factory-inner-container">
        <div className="factory-addfactory-buttonfield">
          <ButtonField
            label="Add Shifts "
            img={PlusIcon}
            className="add-factory-button"
            onClick={() => {
              setShowAddFactoryPopup(true);
            }}
            type={Button}
          />
        </div>

        <div className="factory-list-container">
          <Table
            headers={[
              {
                id: "plantName",
                label: "Plant Name",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "plant",
              },
              {
                id: "startDate",
                label: "Start Date",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "startDate",
              },
              {
                id: "startTime",
                label: "Start Time",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "startTime",
              },
              {
                id: "endDate",
                label: "End Date",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "endDate",
              },
              {
                id: "endTime",
                label: "End Time",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "endTime",
              },
              {
                id: "numOfShifts",
                label: "No. of Shifts",
                width: 50,
                responsive: true,
                sortable: true,
                dataTestid: "numOfShifts",
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
            tableTitle={"Total Days"}
            showPageEntryContainer={false}
            data={factory.map(formatFactoryData)}
            defaultOrderBy={"factoryName"}
            defaultSortOrder={"asc"}
            userManage={false}
            editAction={(data) => {
              editFactoryDays(data);
            }}
            deleteAction={(data) => showFactoryDeleteAction(data)}
            viewAction={(data) => {
              viewFactoryDays(data);
            }}
          />
        </div>
        {showAddFactoryPopup && (
          <AddFactory
            setShowAddFactoryPopup={setShowAddFactoryPopup}
            fromListFactory={true}
          />
        )}
      </div>
      {showDeletePopUP ? (
        <Model
          disableCancel={false}
          onCancel={() => setShowDeletePopUp(false)}
          onOk={deleteFactory}
          show={showDeletePopUP}
          content={`Are you sure you want to delete`}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default ListFactory;
