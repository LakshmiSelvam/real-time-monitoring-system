import "../../../common/component/InputField.js";
import { useState, useEffect, useRef } from "react";
import InputField from "../../../common/component/InputField.js";
import ButtonField from "../../../common/component/ButtonField.js";
import Model from "../../../common/component/Model.js";
import { Navigate, useNavigate } from "react-router-dom";
import * as API from "../../../common/api/index.js";
import URL from "../../../common/api/constantURL.js";
import {
  setSnackData,
  setBaseUrl,
  setPlantList,
} from "../../../redux/action/userAction.js";
import { useDispatch, useSelector } from "react-redux";
import Calender from "../../../common/component/Calendar.js";
import CancelIcon from "../../../assets/images/cancel.png";
import moment from "moment";
import { Button, TimePicker } from "antd";
import "../../../common/Style/TimePicker.css";
import "../../Style/AddFactoryDetails.css";
import { setLoading, setLoggedUser } from "../../../redux/action/userAction.js";
import dayjs from "dayjs";
import SelectBox from "../../../common/component/SelectBox";
import { jwtDecode } from "jwt-decode";
import { RiDeleteBinLine } from "react-icons/ri";
function AddFactory({ fromListFactory, login }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const plantList = useSelector((state) => state.userReducer.plantList);
  // console.log("plantList", plantList);
  const [shiftInputs, setShiftInputs] = useState([]);
  const [deletedShifts, setDeletedShifts] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [calendarToDate, setCalendarToDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [previouseDate, setPreviouseDate] = useState(true);
  const [nextDate, setNextDate] = useState(false);
  const [showAddFactoryPopup, setShowAddFactoryPopup] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [factoryData, setFactoryData] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [showErrorPopUP, setShowErrorPopUp] = useState(false);
  const [error, setError] = useState(false);
  const [plantsWithLabels, setPlantsWithLabels] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [apiResult, setAPIResult] = useState([]);
  const [form, setForm] = useState({
    PlantName: "",
  });
  const timezone = localStorage.getItem("timeZone");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    let authToken = localStorage.getItem("authToken");
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      let userId = decodedToken.user.userId;
      const result = await API.getAPI(URL.getUserById + userId);
      dispatch(setLoading(true));
      if (result.fetchStatus === "failure") {
        dispatch(setLoading(false));
      } else {
        if (result.result.message === "success") {
          dispatch(setLoggedUser(result.result.data));
          // console.log("result.result.data", result.result.data.companyCode);
          localStorage.setItem("companyCode", result.result.data.companyCode);
          fetchBaseUrl(result.result.data.companyCode);
        } else {
          dispatch(setLoading(false));
        }
      }
    } else {
      dispatch(setLoading(false));
    }
  };
  // useEffect(() => {
  //   fetchbaseUrl();
  // }, []);

  const fetchBaseUrl = async () => {
    let companyCode = localStorage.getItem("companyCode");
    let body = {
      companyCode: companyCode,
    };
    // console.log("code", companyCode);
    const result = await API.postAPI(URL.getBaseURL, body);
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    } else {
      if (result.result.message === "success") {
        dispatch(setBaseUrl(result.result.data.baseUrl));
        // fetchHomeData(result.result.data.baseUrl);
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    }
  };

  useEffect(() => {
    const fetchPlants = async () => {
      if (!baseURL) return;
      dispatch(setLoading(true));

      try {
        let result = await API.getAPI(baseURL + "/plants/get");
        if (
          result.fetchStatus === "failure" ||
          result.result.message !== "success"
        ) {
          throw new Error("Failed to fetch Plant details");
        }
        dispatch(setPlantList(result.result.data));
      } catch (error) {
        console.error("Error fetching machine details:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPlants();
  }, [baseURL]);

  useEffect(() => {
    const plantsWithLabels = plantList?.map((plant) => {
      return {
        ...plant,
        value: plant.plantName,
        label: plant.plantName,
        id: plant.plantId,
      };
    });

    setPlantsWithLabels(plantsWithLabels);
    if (plantsWithLabels.length > 0) {
      setSelectedValue([plantsWithLabels[0].label]);
    }
  }, [plantList]);

  useEffect(() => {
    if (form.PlantName) {
      getTodayFactoryDetails(form.PlantName);
    } else {
      getTodayFactoryDetails(plantList[0]?.plantId);
    }
  }, [form.PlantName]);

  useEffect(() => {
    let shiftData = shiftInputs?.[0];
    let shiftStartTime = new Date(shiftData?.startTime);
    const dateInLocalTimezone1 = shiftStartTime.toLocaleString("en-US", {
      timeZone: timezone,
    });
    const parsedDate = dayjs(dateInLocalTimezone1);
    setStartTime(parsedDate);
  }, [shiftInputs?.[0]?.startTime]);

  useEffect(() => {
    let shiftEndTime = new Date(shiftInputs?.[shiftInputs.length - 1]?.endTime);
    const dateInLocalTimezone2 = shiftEndTime.toLocaleString("en-US", {
      timeZone: timezone,
    });
    const parsedEnd = dayjs(dateInLocalTimezone2);
    setEndTime(parsedEnd);
  }, [shiftInputs?.[shiftInputs.length - 1]?.endTime]);

  const updateFactoryData = async (e) => {
    e.preventDefault();
    try {
      const dateObject = new Date(selectedDate);
      const endDateObj = new Date(selectedToDate);

      const formattedDate = dateObject.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      const formattedEndDate = endDateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      const formattedTime = startTime.format("HH:mm:ss");
      const formattedEndTime = endTime.format("HH:mm:ss");

      const isoDateTimeString = new Date(
        `${formattedDate} ${formattedTime}`
      ).toISOString();
      const isDateToTimeString = new Date(
        `${formattedEndDate} ${formattedEndTime}`
      ).toISOString();

      if (factoryData && isEdited) {
        console.log("update", factoryData.id);
        const updateData = {
          id: apiResult?.id,
          plantId: form.PlantName,
          factoryDayStart: isoDateTimeString,
          factoryDayEnd: isDateToTimeString,
          shifts: shiftInputs.map((shift, index) => ({
            shift: shift.value,
            startTime: startTimeChange(
              shift.startTime,
              index > 0 ? shiftInputs[index - 1].endTime : null
            ),
            endTime: endTimeChange(
              index > 0 ? shiftInputs[index - 1].endTime : null,
              shift.startTime,
              shift.endTime
            ),
          })),
        };

        let result = await API.patchAPI(baseURL + "/erp/update", updateData);
        if (result.fetchStatus === "success") {
          let snackData = {
            showSnack: true,
            // snackMessage: result.message, || TODO
            snackMessage: "Shifts Updated Successfully",
            snackVariant: "success",
          };

          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));

          navigate("/home/dashboard");
        } else {
          let snackData = {
            showSnack: true,
            snackMessage: result.message,
            snackVariant: "error",
          };
          setError(true);
          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));
        }
      } else if (!factoryData && isEdited) {
        console.log("Create");

        const data = {
          plantId: form.PlantName,
          factoryDayStart: isoDateTimeString,
          factoryDayEnd: isDateToTimeString,
          shifts: shiftInputs.map((shift, index) => ({
            shift: shift.value,
            startTime: startTimeChange(
              shift.startTime,
              index > 0 ? shiftInputs[index - 1].endTime : null
            ),
            endTime: endTimeChange(
              index > 0 ? shiftInputs[index - 1].endTime : null,
              shift.startTime,
              shift.endTime
            ),
          })),
        };
        let result = await API.postAPI(baseURL + "/erp/create", data);
        if (result.fetchStatus === "success") {
          let snackData = {
            showSnack: true,
            snackMessage: result.message,
            snackVariant: "success",
          };
          dispatch(setSnackData("Shift Data Created Successfully"));
          dispatch(setLoading(false));
          navigate("/home/dashboard");
        } else {
          let snackData = {
            showSnack: true,
            snackMessage: result.message,
            snackVariant: "error",
          };

          dispatch(setLoading(false));
          setError(true);
        }
      } else if (factoryData && !isEdited) {
        console.log("Nothing");
        navigate("/home/dashboard");
      }
    } catch (error) {
      setError(true);
    }
  };

  // convert 24hrs formate
  const parseHour = (time) => {
    const hour = parseInt(time.match(/\d+/)[0]);
    if (time.toLowerCase().includes("pm") && hour !== 12) {
      return hour + 12;
    }
    if (time.toLowerCase().includes("am") && hour === 12) {
      return 0;
    }
    return hour;
  };
  //check the time interval
  const handleCheckTime = (endtime, startTime) => {
    if (endtime) {
      const hour1 = parseHour(endtime);
      const hour2 = parseHour(startTime);
      return hour2 >= hour1;
    }
  };
  const handledCheckTime = (endtime, startTime, prevEndTime) => {
    if (prevEndTime) {
      const hour1 = parseHour(prevEndTime);
      const hour2 = parseHour(startTime);
      const hour3 = parseHour(endtime);
      return hour2 >= hour1 && hour3 >= hour2;
    }
  };
  const startTimeChange = (time, endtime) => {
    if (typeof time == "string") {
      if (typeof endtime == "object") {
        endtime = moment(new Date(endtime)).format("HH:mm:ss A");
      }
      if (typeof time == "object") {
        time = moment(new Date(time)).format("HH:mm:ss A");
      }
      let dateObj;
      dateObj = handleCheckTime(endtime, time);
      let startDate;
      if (dateObj == undefined || dateObj) {
        startDate = selectedDate;
      } else {
        startDate = moment(selectedDate).add(1, "days").format("MM-DD-YYYY");
      }
      let localDate = moment(startDate).format("YYYY-MM-DD");
      let datetime = `${localDate} ${time}`;
      let utc = new Date(datetime).toUTCString();
      let formatedTime = new Date(utc).toISOString();
      return formatedTime;
    } else {
      let dateObj;
      let startDate;
      let times;
      if (typeof endtime == "object") {
        endtime = moment(new Date(endtime)).format("HH:mm:ss A");
      }
      if (typeof time == "object") {
        times = moment(time.$d).format("HH:mm:ss A");
      }
      dateObj = handleCheckTime(endtime, times);
      if (dateObj == undefined || dateObj) {
        startDate = selectedDate;
      } else {
        startDate = moment(selectedDate).add(1, "days").format("MM-DD-YYYY");
      }
      const { $D, $H, $M, $m, $s, $y } = time;

      const localDate = new Date(time.$d);
      localDate.setFullYear($y);
      localDate.setMonth($M);
      localDate.setDate($D);
      localDate.setHours($H);
      localDate.setMinutes($m);
      localDate.setSeconds($s);
      const utcDate = moment.utc(localDate);

      utcDate.set("date", moment(startDate).date());

      const modifiedDateTimeString = utcDate.format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      return modifiedDateTimeString;
    }
  };
  const endTimeChange = (prevEndTime, startTime, time) => {
    if (typeof time == "string") {
      if (typeof prevEndTime == "object") {
        prevEndTime = moment(new Date(prevEndTime)).format("HH:mm:ss A");
      }
      if (typeof startTime == "object") {
        startTime = moment(new Date(startTime)).format("HH:mm:ss A");
      }
      if (typeof time == "object") {
        time = moment(new Date(time)).format("HH:mm:ss A");
      }
      let dateObj;
      dateObj = handledCheckTime(time, startTime, prevEndTime);
      let endDate;
      if (dateObj == undefined || dateObj) {
        endDate = selectedDate;
      } else {
        endDate = moment(selectedDate).add(1, "days").format("MM-DD-YYYY");
      }
      let localDate = moment(endDate).format("YYYY-MM-DD");
      let datetime = `${localDate} ${time}`;

      let utc = new Date(datetime).toUTCString();
      let formatedTime = new Date(utc).toISOString();
      return formatedTime;
    } else {
      let dateObj;
      let endDate;
      let times;
      if (typeof prevEndTime == "object") {
        prevEndTime = moment(new Date(prevEndTime)).format("HH:mm:ss A");
      }
      if (typeof startTime == "object") {
        startTime = moment(new Date(startTime)).format("HH:mm:ss A");
      }
      if (typeof time == "object") {
        times = moment(new Date(time)).format("HH:mm:ss A");
      }
      dateObj = handleCheckTime(times, startTime, prevEndTime);
      if (dateObj == undefined || dateObj) {
        endDate = selectedDate;
      } else {
        endDate = moment(selectedDate).add(1, "days").format("MM-DD-YYYY");
      }
      const { $D, $H, $M, $m, $s, $y } = time;
      const localDate = new Date(time.$d);
      localDate.setFullYear($y);
      localDate.setMonth($M);
      localDate.setDate($D);
      localDate.setHours($H);
      localDate.setMinutes($m);
      localDate.setSeconds($s);
      const utcDate = moment.utc(localDate);
      utcDate.set("date", moment(endDate).date());
      const modifiedDateTimeString = utcDate.format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      return modifiedDateTimeString;
    }
  };
  // fetching ERP data from the database based on the plant id
  const getTodayFactoryDetails = async (plantId) => {
    if (localStorage.getItem("baseURL")) {
    } else {
      localStorage.setItem("plantId", plantId);
    }

    let body = {
      plantId: plantId,
    };

    let result;

    try {
      result = await API.postAPI(baseURL + "/erp/erp-today", body);
    } catch (error) {
      // console.error("Error fetching factory details:", error);
      result = { fetchStatus: "failure", message: "Failed to fetch data" };
    }

    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      setFactoryData(false);
      setSelectedDate("");
      setSelectedToDate("");
      setShiftInputs([]);
      // dispatch(setSnackData(snackData));
      dispatch(setLoading(false));
      return;
    }

    if (result.result.statusCode === 200) {
      const factoryData = result.result.data;

      if (factoryData != null) {
        setFactoryData(true);
        setAPIResult(result.result.data);
        setSelectedDate(new Date(factoryData.factoryDayStart));
        setSelectedToDate(new Date(factoryData.factoryDayEnd));
        const shiftInputs = factoryData.shifts.map((shift, index) => ({
          id: index + 1,
          value: shift.shift,
          startTime: new Date(shift.startTime).toLocaleTimeString("en-US", {
            timeZone: timezone,
            hour12: false,
          }),
          endTime: new Date(shift.endTime).toLocaleTimeString("en-US", {
            timeZone: timezone,
            hour12: false,
          }),
        }));
        setShiftInputs(shiftInputs);
        let shiftData = factoryData?.shifts;
        let shiftStartTime = new Date(shiftData[0]?.startTime);
        let shiftEndTime = new Date(shiftData[shiftData.length - 1]?.endTime);

        const dateInLocalTimezone1 = shiftStartTime.toLocaleString("en-US", {
          timeZone: timezone,
          hour12: false,
        });
        const dateInLocalTimezone2 = shiftEndTime.toLocaleString("en-US", {
          timeZone: timezone,
          hour12: false,
        });

        const parsedDate = dayjs(dateInLocalTimezone1);
        const parsedEnd = dayjs(dateInLocalTimezone2);
        setStartTime(parsedDate);
        setEndTime(parsedEnd);
      } else {
        setFactoryData(false);
        setSelectedDate("");
        setSelectedToDate("");
        setShiftInputs([]);
        setStartTime("");
      }
    } else {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "success",
      };
      setFactoryData(false);
      setSelectedDate("");
      setSelectedToDate("");
      setShiftInputs([]);
      // dispatch(setSnackData(snackData));
      dispatch(setLoading(false));
      setStartTime("");
      setEndTime("");
    }
  };

  const addShift = () => {
    const newShiftId = shiftInputs.length + 1;
    setShiftInputs([
      ...shiftInputs,
      {
        id: newShiftId,
        value: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };
  const handleShiftCancel = (shiftId) => {
    const deletedShift = shiftInputs.find((shift) => shift.id === shiftId);
    setDeletedShifts((prevDeletedShifts) => [
      ...prevDeletedShifts,
      deletedShift,
    ]);
    const updatedShifts = shiftInputs.filter((shift) => shift.id !== shiftId);
    setShiftInputs(updatedShifts);
  };

  // const handleAddFactory = async (event) => {
  //   event.preventDefault();
  //   // Handle the logic to save factory details with shifts
  //   const createFactoryData = {
  //     factoryDayStart: selectedDate,
  //     factoryDayEnd: selectedToDate,
  //     shifts: shiftInputs.map((shift) => ({
  //       shift: shift.value,
  //       startTime: moment(shift.startTime).format("HH:mm:ss"),
  //       endTime: moment(shift.endTime).format("HH:mm:ss"),
  //     })),
  //   };
  //   createFactoryData();
  // };

  const calendarRef = useRef();
  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(e.target)
      ) {
        setShowCalendar(false);
        setShowToCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, [showCalendar, showToCalendar]);

  const monthChange = (date, type) => {
    if (type === "From") {
      let tempDate = new Date(date);
      setCalendarDate(tempDate);
    } else {
      let tempDate = new Date(date);
      setCalendarToDate(tempDate);
    }
  };
  function dateChange(date, type) {
    if (type === "From") {
      if (new Date() < date) {
        date = new Date();
      }

      setCalendarDate(date);
      setSelectedDate(date);
      setShowCalendar(false);
      setIsEdited(true);
      setError(false);
    } else {
      if (new Date() < date) {
        date = new Date();
      }
      setCalendarToDate(date);
      setSelectedToDate(date);
      setShowToCalendar(false);
      setIsEdited(true);
      setError(false);
    }
  }
  // const onChangeStart = (time) => {
  //   if (time) {
  //     setStartTime(time);
  //     setIsEdited(true);
  //   }
  // };
  // const onChangeEnd = (time) => {
  //   if (time) {
  //     setEndTime(time);
  //     setIsEdited(true);
  //   }
  // };
  const onChangeShiftStartTime = (time, id) => {
    const updatedShifts = shiftInputs.map((shift) =>
      id === shift.id
        ? { ...shift, startTime: time ? time : shift.startTime }
        : shift
    );
    setShiftInputs(updatedShifts);
    setIsUpdate(true);
    setIsEdited(true);
    setError(false);
  };

  const onChangeShiftEndTime = (time, id) => {
    // console.log("chanhe time", time, id);
    const updatedShifts = shiftInputs.map((shift) =>
      id === shift.id
        ? { ...shift, endTime: time ? time : shift.endTime }
        : shift
    );
    setShiftInputs(updatedShifts);
    setIsUpdate(true);
    setIsEdited(true);
    setError(false);
  };

  const handleAddFactoryDataCancel = () => {
    setShowAddFactoryPopup(false);
    navigate("/home/account");
  };

  const validateForm = () => {
    // Check if any field is empty or not filled
    if (
      selectedDate === null ||
      selectedToDate === null ||
      shiftInputs.some(
        (shift) =>
          shift.value.trim() === "" || !shift.startTime || !shift.endTime
      )
    ) {
      // If any required field is empty, show the error model
      setShowErrorPopUp(true);
      return false;
    }
    return true;
  };

  // Function to handle "Ok" button click
  const handleOkButtonClick = async (event) => {
    localStorage.setItem("ack", "OK");
    // event.preventDefault();
    // const isValid = validateForm();
    // if (isValid) {
    //   await updateFactoryData();
    //   navigate("/home/dashboard");
    // }
  };
  const handlePlantChange = (event) => {
    setForm({
      ...form,
      PlantName: event,
    });
    setIsEdited(false);
    setError(false);
  };

  useEffect(() => {}, []);
  console.log("end time....", endTime);
  return (
    <div className="add-factory-popup">
      <div className="add-factory-model">
        <form
          className="add-factory-model-content"
          onSubmit={handleOkButtonClick}
        >
          <div className="add-factory-pop-title">Shifts Details</div>
          <div className="erp-plant-select">
            <SelectBox
              options={plantsWithLabels}
              value={form.PlantName}
              handleChange={(event) => handlePlantChange(event, "plantName")}
              className="home-search2"
              defaultText={
                form.PlantName ? form.PlantName : plantsWithLabels[0]?.label
              }
            />
          </div>
          {/* {factoryData ? ( */}
          <>
            <div className="factory-pop-by-day">
              <div className="start-day-pop-section">
                <span className="factory-pop-title">Shift Start Day</span>
                <div className="factory-selectbox">
                  <input
                    className="request-service-date "
                    placeholder="Choose Date"
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                    }}
                    value={
                      selectedDate
                        ? moment(selectedDate).format("MM/DD/YYYY")
                        : "Select From Date"
                    }
                  />
                  {showCalendar ? (
                    <div
                      className="date-picker-container"
                      data-testid="date-picker-container"
                      ref={calendarRef}
                    >
                      <Calender
                        active={calendarDate || new Date()}
                        highlightDates={[]}
                        monthChange={(data) => monthChange(data, "From")}
                        onChange={(data) => dateChange(data, "From")}
                        previouseDate={previouseDate}
                        nextDate={nextDate}
                        currentDate={
                          localStorage.getItem("timeZone")
                            ? moment(new Date()).tz(
                                localStorage.getItem("timeZone")
                              )._d
                            : new Date()
                        }
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="end-time-timepicker-with-date">
                    {/* <TimePicker
                      value={factoryData ? startTime : ""}
                      onChange={onChangeStart}
                      placeholder="Select Time"
                    /> */}

                    <input
                      value={
                        startTime && startTime.$d != "Invalid Date"
                          ? moment(new Date(startTime)).format("HH:mm:ss")
                          : "From Time"
                      }
                      className="time-picker-inputs"
                    />
                  </div>
                </div>
              </div>
              <div className="end-day-section">
                <span className="end-factory-title">Shift End Day</span>

                <div className="factory-selectbox">
                  <input
                    className="request-service-date "
                    placeholder="Choose Date"
                    onClick={() => setShowToCalendar(!showToCalendar)}
                    value={
                      selectedToDate
                        ? moment(calendarToDate).format("MM/DD/YYYY")
                        : "Select To  Date"
                    }
                  />
                  {showToCalendar ? (
                    <div className="date-picker-to-container" ref={calendarRef}>
                      <Calender
                        active={calendarToDate || new Date()}
                        highlightDates={[]}
                        monthChange={(data) => monthChange(data, "To")}
                        onChange={(data) => dateChange(data, "To")}
                        previouseDate={previouseDate}
                        nextDate={nextDate}
                        currentDate={
                          localStorage.getItem("timeZone")
                            ? moment(new Date()).tz(
                                localStorage.getItem("timeZone")
                              )._d
                            : new Date()
                        }
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="end-time-timepicker-with-date">
                    {/* <TimePicker
                      value={factoryData ? endTime : ""}
                      onChange={onChangeEnd}
                      placeholder="Select Time"
                    /> */}

                    <input
                      value={
                        endTime && endTime.$d != "Invalid Date"
                          ? moment(new Date(endTime)).format("HH:mm:ss")
                          : "End Time"
                      }
                      className="time-picker-inputs"
                      // disabled={isErpEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="factory-pop-shift-list">
              <div className="add-shift-btn-container">
                <ButtonField
                  label="Add Shift"
                  onClick={addShift}
                  className="add-shift-btn"
                  type="button"
                />
              </div>
              <div className="adding-shifts">
                {shiftInputs.map((shiftInput) => (
                  <div
                    key={shiftInput.id}
                    className="factory-shift-input-container"
                  >
                    <InputField
                      type="text"
                      name={`shiftName${shiftInput.id}`}
                      className="input-field"
                      placeHolderType="bold"
                      placeholder={`${shiftInput.value}`}
                      autoComplete="off"
                      value={shiftInput.value}
                      onChange={(event) => {
                        const updatedShiftInputs = shiftInputs.map((shift) =>
                          shift.id === shiftInput.id
                            ? { ...shift, value: event.target.value }
                            : shift
                        );
                        setShiftInputs(updatedShiftInputs);
                        setIsEdited(true);
                        setError(false);
                      }}
                    />
                    <div className="start-time-timepicker">
                      <TimePicker
                        placeholder="Start Time"
                        value={
                          shiftInput.startTime
                            ? dayjs(shiftInput.startTime, "HH:mm:ss")
                            : ""
                        }
                        onChange={(event) =>
                          onChangeShiftStartTime(event, shiftInput.id)
                        }
                      />
                    </div>
                    <div className="end-time-timepicker">
                      <TimePicker
                        placeholder="End Time"
                        value={
                          shiftInput.endTime
                            ? dayjs(shiftInput.endTime, "HH:mm:ss")
                            : ""
                        }
                        onChange={(event) =>
                          onChangeShiftEndTime(event, shiftInput.id)
                        }
                      />
                    </div>
                    {/* <img
                      src={CancelIcon}
                      alt="Cancel"
                      className="cancel-icon"
                      onClick={() => {
                        handleShiftCancel(shiftInput.id);
                      }}
                    /> */}
                    <RiDeleteBinLine
                      className="cancel-icon"
                      onClick={() => {
                        handleShiftCancel(shiftInput.id);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {error ? (
              <div className="erp-error-msg">
                {"Please Select Valid Date and Time"}
              </div>
            ) : (
              ""
            )}
            <div className="add-factory-submit-buttons">
              {fromListFactory && (
                <div className="factory-cancel-btn">
                  <ButtonField
                    label="Cancel"
                    onClick={handleAddFactoryDataCancel}
                    className="add-factory-cancel-btn"
                  />
                </div>
              )}

              <div className="factory-submit-btn">
                <ButtonField
                  label={!factoryData ? "ADD" : isEdited ? "Update" : "OK"}
                  onClick={(e) => updateFactoryData(e)}
                  className="add-factory-submit-btn"
                />
              </div>
            </div>
          </>
        </form>
      </div>
      {showErrorPopUP ? (
        <Model
          disableCancel={false}
          onCancel={() => setShowErrorPopUp(false)}
          // onOk={() => setShowErrorPopUp(false)}
          show={showErrorPopUP}
          content={`Please enter the required data`}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default AddFactory;
