import "../../Style/AccountSetting.css";
import "../../Style/Factory.css";
import "../../../common/component/InputField";
import { useState, useEffect, useRef } from "react";
import InputField from "../../../common/component/InputField";
import ButtonField from "../../../common/component/ButtonField";
import Model from "../../../common/component/Model";
import { useNavigate } from "react-router-dom";
import * as API from "../../../common/api/index.js";
import URL from "../../../common/api/constantURL";
import { setSnackData } from "../../../redux/action/userAction";
import { useDispatch, useSelector } from "react-redux";
import Calender from "../../../common/component/Calendar.js";
import moment from "moment";
import CancelIcon from "../../../assets/images/cancel.png";
import BackArrow from "../../../assets/images/BackArrow.png";
import { TimePicker } from "antd";
import "../../../common/Style/TimePicker.css";
import { setLoading } from "../../../redux/action/userAction.js";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { DatePicker, InputGroup } from "rsuite";

function FactoryDetails() {
  let isErpEdit = localStorage.getItem("erpIsEdit");
  let isErpView = localStorage.getItem("erpIsView");

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState("");

  const [factoryModel, setFactoryModel] = useState(false);
  const [deletedShifts, setDeletedShifts] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [calendarToDate, setCalendarToDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [previouseDate, setPreviouseDate] = useState(true);
  const [nextDate, setNextDate] = useState(false);
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  var [ErrorMessage, setErrorMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [factoryData, setFactoryData] = useState({
    factoryDayStart: "",
    factoryDayEnd: "",
    shifts: [],
  });
  const [validTime, setIsValidTime] = useState(true);
  const [checkUpdate, setCheckUpdate] = useState(false);
  useEffect(() => {
    // console.log("Factory ID:", id);
    fetchData(id);
  }, [id]);

  const [shiftInputs, setShiftInputs] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false);

  // Make a GET request to the API endpoint to fetch factory data
  const fetchData = async (id) => {
    let result = await API.getAPI(
      `https://demo-apps.sitesenz.com/api/dev/api/v1/erp/get/${id}`
    );
    console.log("get factory...", result);
    if (result.fetchStatus === "failure") {
      setErrorMessage("Server down.Failed to fetch");
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "success",
      };
      dispatch(setSnackData(snackData));
      dispatch(setLoading(false));
    } else {
      if (result.result.statusCode === 200) {
        const responseData = result.result.data[0];

        setFactoryData({
          id: responseData.id,
          factoryDayStart: responseData.factoryDayStart,
          factoryDayEnd: responseData.factoryDayEnd,
          shifts: responseData.shifts,
        });
        dispatch(setLoading(false));
        setIsEdit(true);
        setIsView(false);
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
  };

  const timezone = localStorage.getItem("timeZone");
  useEffect(() => {
    if (factoryData.factoryDayStart) {
      const dateInUTC1 = new Date(factoryData.factoryDayStart);
      const dateInLocalTimezone1 = dateInUTC1.toLocaleString("en-US", {
        timeZone: timezone,
        hour12: false,
      });
      setSelectedDate(dateInLocalTimezone1);
    }
    if (factoryData.factoryDayEnd) {
      const dateInUTC2 = new Date(factoryData.factoryDayEnd);
      const dateInLocalTimezone2 = dateInUTC2.toLocaleString("en-US", {
        timeZone: timezone,
        hour12: false,
      });
      setSelectedToDate(dateInLocalTimezone2);
    }

    if (factoryData && factoryData.shifts && factoryData.shifts.length > 0) {
      setShiftInputs(
        factoryData.shifts.map((shift, index) => ({
          id: index,
          value: shift.shift,
          startTime: new Date(shift.startTime).toLocaleTimeString("en-US", {
            timeZone: timezone,
            hour12: false,
          }),
          endTime: new Date(shift.endTime).toLocaleTimeString("en-US", {
            timeZone: timezone,
            hour12: false,
          }),
        }))
      );
    }
  }, [factoryData]);

  // useEffect(() => {
  //   setShiftInputs(shiftInputs);
  // }, [shiftInputs]);
  const handleFactoryCancel = () => {
    revertDeletedShifts();
    setFactoryModel(false);
  };

  const handleFactoryOk = async () => {
    const dateObject = new Date(selectedDate);
    const endDateObj = new Date(selectedToDate);
    const formattedDate = dateObject.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    // console.log("formattedDate", formattedDate);

    const formattedTime = startTime.format("HH:mm:ss");

    const isoDateTimeString = new Date(
      `${formattedDate} ${formattedTime}`
    ).toISOString();
    //end date
    const formattedEndDate = endDateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const formattedEndTime = endTime.format("HH:mm:ss");

    const isoDateToTimeString = new Date(
      `${formattedEndDate} ${formattedEndTime}`
    ).toISOString();

    try {
      const updateData = {
        factoryDayStart: isoDateTimeString,
        factoryDayEnd: isoDateToTimeString,
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
        id: factoryData.id,
      };
      console.log("try", updateData);
      let result = API.patchAPI(
        "https://demo-apps.sitesenz.com/api/dev/api/v1/erp/update",
        updateData
      );

      dispatch(setLoading(true));
      if (result.fetchStatus === "failure") {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          // snackMessage: result.message,  || TODO
          snackMessage: result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: "Shift Updated Successfully ",
          snackVariant: "success",
        };
        dispatch(setSnackData(snackData));
        navigate("/home/account");
      }
    } catch (error) {
      console.log("catch", error);
    }
    setFactoryModel(false);
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
  const handleShiftCancel = (shiftName) => {
    const deletedShift = shiftInputs.find((shift) => shift.id === shiftName.id);

    setDeletedShifts((prevDeletedShifts) => [
      ...prevDeletedShifts,
      { ...deletedShift },
    ]);
    const updatedShifts = shiftInputs.filter(
      (shift) => shift.id !== shiftName.id
    );

    setShiftInputs(updatedShifts);
  };

  const revertDeletedShifts = () => {
    setShiftInputs((prevShifts) => [
      ...prevShifts,
      ...deletedShifts.filter((deletedShift) =>
        prevShifts.every((shift) => shift.value !== deletedShift.value)
      ),
    ]);
    setDeletedShifts([]);
  };

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
      setIsUpdate(true);
    } else {
      if (new Date() < date) {
        date = new Date();
      }
      setCalendarToDate(date);
      setSelectedToDate(date);
      setShowToCalendar(false);
      setIsUpdate(true);
    }
  }

  useEffect(() => {
    let shiftData = factoryData?.shifts;

    let shiftStartTime = new Date(shiftData[0]?.startTime);
    let shiftEndTime = new Date(shiftData[shiftData.length - 1]?.endTime);

    const dateInLocalTimezone1 = shiftStartTime.toLocaleString("en-US", {
      timeZone: timezone,
    });
    const dateInLocalTimezone2 = shiftEndTime.toLocaleString("en-US", {
      timeZone: timezone,
    });
    const parsedDate = dayjs(dateInLocalTimezone1);
    const parsedEnd = dayjs(dateInLocalTimezone2);

    setStartTime(parsedDate);
    setEndTime(parsedEnd);
  }, [factoryData.factoryDayStart, factoryData.factoryDayEnd, shiftInputs]);

  const onChangeStart = (time) => {
    setStartTime(time);
    setIsUpdate(true);
  };
  const onChangeEnd = (time) => {
    setEndTime(time);
    setIsUpdate(true);
  };
  const onChangeShiftStartTime = (time, id) => {
    const updatedShifts = shiftInputs.map((shift) =>
      id === shift.id
        ? { ...shift, startTime: time ? time : shift.startTime }
        : shift
    );
    setShiftInputs(updatedShifts);
    setIsUpdate(true);
  };

  const onChangeShiftEndTime = (time, id) => {
    const updatedShifts = shiftInputs.map((shift) =>
      id === shift.id
        ? { ...shift, endTime: time ? time : shift.endTime }
        : shift
    );
    setShiftInputs(updatedShifts);
    setIsUpdate(true);
  };

  const handleBackButtonClick = () => {
    navigate("/home/account");
  };

  return (
    <div className="account-container">
      <div className="account-inner-container">
        <img
          src={BackArrow}
          alt="Back"
          className="back-icon"
          onClick={() => {
            handleBackButtonClick();
          }}
        />
        <div className="user-management-content">
          {/* <form> */}
          <div className="factory-by-day">
            <div className="start-day-section">
              <span className="factory-title">Shift Start Day</span>
              <div className="show-selectbox">
                {isErpView == "true" ? (
                  <input
                    className="request-service-date "
                    value={
                      selectedDate
                        ? moment(selectedDate).format("MM/DD/YYYY")
                        : ""
                    }
                    readOnly
                  />
                ) : (
                  <input
                    className="request-service-date "
                    placeholder="Choose Date"
                    onClick={() => {
                      setShowCalendar(!showCalendar);
                    }}
                    value={
                      selectedDate
                        ? moment(selectedDate).format("MM/DD/YYYY")
                        : ""
                    }
                  />
                )}
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

                <div className="time-picker">
                  {/* {isErpView == "true" ? (
                    <input
                      value={moment(new Date(startTime)).format("HH:mm:ss")}
                      className="time-picker-inputs"
                      disabled={isErpEdit}
                    />
                  ) : (
                    <TimePicker
                      value={startTime}
                      onChange={onChangeStart}
                      placeholder="Select Time"
                    />
                  )} */}
                  <input
                    value={moment(new Date(startTime)).format("HH:mm:ss")}
                    className="time-picker-inputs"
                    disabled={isErpEdit}
                  />
                </div>
              </div>
            </div>
            <div className="end-day-section">
              <span className="end-factory-title">Shift End Day</span>

              <div className="show-selectbox">
                {isErpView == "true" ? (
                  <input
                    className="request-service-date "
                    value={
                      selectedDate
                        ? moment(selectedDate).format("MM/DD/YYYY")
                        : ""
                    }
                    readOnly
                  />
                ) : (
                  <input
                    className="request-service-date "
                    placeholder="Choose Date"
                    onClick={() => {
                      setShowToCalendar(!showToCalendar);
                    }}
                    value={
                      selectedToDate
                        ? moment(selectedToDate).format("MM/DD/YYYY")
                        : ""
                    }
                  />
                )}
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
                <div className="time-picker">
                  {/* {isErpView == "true" ? (
                    <input
                      value={moment(new Date(endTime)).format("HH:mm:ss")}
                      className="time-picker-inputs"
                      disabled={isErpEdit}
                    />
                  ) : (
                    <TimePicker
                      value={endTime}
                      onChange={onChangeEnd}
                      placeholder="Select Time"
                    />
                  )} */}
                  <input
                    value={moment(new Date(endTime)).format("HH:mm:ss")}
                    className="time-picker-inputs"
                    disabled={isErpEdit}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="factory-shift-list">
            <div className="shift-list-name">Shift Name </div>
            {shiftInputs.map((shiftInput) => (
              <div key={shiftInput.id} className="shift-input-container">
                <InputField
                  type="text"
                  name={`shiftName${shiftInput.value}`}
                  className="input-field"
                  placeHolderType="bold"
                  placeholder={`${shiftInput.value}`}
                  autoComplete="off"
                  value={shiftInput.value}
                  onChange={(event) => {
                    const updatedShiftInputs = shiftInputs.map((shift) =>
                      shift.value === shiftInput.value
                        ? { ...shift, value: event.target.value }
                        : shift
                    );
                    setShiftInputs(updatedShiftInputs);
                    setIsUpdate(true);
                  }}
                  disabled={isErpView === "true"}
                />
                {/* {console.log("shiftInput.startTime", shiftInput.startTime)}
                {console.log(
                  "dayjs",
                  moment(shiftInput.endTime).format("HH:mm:ss")
                )} */}
                <div className="time-picker">
                  {isErpView == "true" ? (
                    <input
                      value={dayjs(shiftInput.startTime, "HH:mm:ss").format(
                        "HH:mm:ss"
                      )}
                      className="time-picker-inputs"
                      disabled={isErpEdit}
                    />
                  ) : (
                    <TimePicker
                      placeholder="Start Time"
                      value={dayjs(shiftInput.startTime, "HH:mm:ss")}
                      onChange={(event) =>
                        onChangeShiftStartTime(event, shiftInput.id)
                      }
                    />
                  )}
                </div>
                <div className="time-picker">
                  {isErpView == "true" ? (
                    <input
                      value={dayjs(shiftInput.endTime, "HH:mm:ss").format(
                        "HH:mm:ss"
                      )}
                      className="time-picker-inputs"
                      disabled={isErpEdit}
                    />
                  ) : (
                    <TimePicker
                      placeholder="End Time"
                      value={dayjs(shiftInput.endTime, "HH:mm:ss")}
                      onChange={(event) =>
                        onChangeShiftEndTime(event, shiftInput.id)
                      }
                    />
                  )}
                </div>

                {isErpView == "false" ? (
                  <img
                    src={CancelIcon}
                    alt="Cancel"
                    className="cancel-icon"
                    onClick={() => {
                      // handleShiftCancel(shiftInput.value);
                      handleShiftCancel(shiftInput);
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
          {isErpEdit === "true" ? (
            <ButtonField
              className="factory-update-btn"
              label="Update"
              onClick={() => {
                setFactoryModel(true);
              }}
            />
          ) : (
            ""
          )}
          {!validTime && !checkUpdate ? (
            <div>{"Please select the valid time"}</div>
          ) : (
            ""
          )}
          {factoryModel && (
            <Model
              disableCancel={false}
              onCancel={handleFactoryCancel}
              onOk={handleFactoryOk}
              show={factoryModel}
              content="Are you sure wanted to update the factory details !"
            />
          )}
          {/* </form> */}
        </div>
      </div>
    </div>
  );
}
export default FactoryDetails;
