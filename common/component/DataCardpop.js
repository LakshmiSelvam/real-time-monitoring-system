import "../Style/Cardpopup.css";
import React, { useState, useEffect, useRef } from "react";
import Calender from "./Calendar.js";
import moment from "moment";
import * as API from "../../common/api/index.js";
import { useDispatch, useSelector } from "react-redux";
import NewLineChart from "../Charts/NewLineChart.js";
import Download from "../../assets/images/download.png";
import Pdf from "./OnClickPdf.js";
import Table from "./Table.js";

function DataCardPopup({ data, setShowPopup }) {
  // console.log("data", data);
  const { plantId, title, PlantName } = data;
  const childRef = useRef(null);
  const popupRef = useRef(null);
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const plantList = useSelector((state) => state.userReducer.plantList);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarToDate, setCalendarToDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [previouseDate, setPreviouseDate] = useState(true);
  const [viewReport, setViewReport] = useState(false);
  const [nextDate, setNextDate] = useState(false);
  const [form, setForm] = useState({
    FromDate: selectedDate,
    ToDate: selectedToDate,
  });
  // console.log("plant id", plantsWithLabels);
  const [dateError, setDateError] = useState(false);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState(null); // State to manage chart data
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [minTimestamp, setMinTimestamp] = useState("");
  const [maxTimestamp, setMaxTimestamp] = useState("");
  const [plantName, setPlantName] = useState("");
  const [plantAddress, setPlantAddress] = useState("");
  const [noDataMessage, setNoDataMessage] = useState("");

  // Extract and format the tag from the title
  const extractTag = (title) => {
    const tagWord = title.split(" ").find((word) => word.startsWith("#"));
    return tagWord ? tagWord.replace(/#/g, "").toUpperCase() : "";
  };

  const tag = extractTag(title);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calendarRef = useRef();

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (
        (showCalendar &&
          calendarRef.current &&
          !calendarRef.current.contains(e.target)) ||
        (showToCalendar &&
          calendarRef.current &&
          !calendarRef.current.contains(e.target))
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
      setForm({
        ...form,
        FromDate: date,
      });
      setCalendarDate(date);
      setSelectedDate(date);
      setShowCalendar(false);
      setViewReport(false);
      setDateError(false);
      setError("");
    } else {
      if (date < form.FromDate) {
        setDateError(true);
        return;
      } else {
        if (new Date() < date) {
          date = new Date();
        }
        setForm({
          ...form,
          ToDate: date,
        });
        setCalendarToDate(date);
        setSelectedToDate(date);
        setShowToCalendar(false);
      }
    }
  }

  const localizeTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const timezone = localStorage.getItem("timeZone");
    const dateInUTC = new Date(timestamp);
    return dateInUTC.toLocaleString("en-US", {
      timeZone: timezone,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // Function to find the timestamp corresponding to a given value
  const findTimestamp = (value, data) => {
    for (const entry of data) {
      if (parseFloat(entry.oee) === parseFloat(value)) {
        return entry.timeStamp;
      }
      if (parseFloat(entry.availability) === parseFloat(value)) {
        return entry.timeStamp;
      }
      if (parseFloat(entry.quality) === parseFloat(value)) {
        return entry.timeStamp;
      }
      if (parseFloat(entry.energy) === parseFloat(value)) {
        return entry.timeStamp;
      }
      if (parseFloat(entry.performance) === parseFloat(value)) {
        return entry.timeStamp;
      }
    }
    return null;
  };

  const fetchChartData = async () => {
    // const plantId = plantsWithLabels[0].plantId;
    const requestData = {
      plantId: plantId,
      tag: tag,
      startDate: moment(form.FromDate).toISOString(),
      endDate: moment(form.ToDate).toISOString(),
    };
    // console.log("request", requestData);
    const result = await API.postAPI(
      baseURL + "/reports/get-onclick-history",
      requestData
    );
    // console.log("result", result);

    if (result && result.result.data) {
      const chartData = result.result.data; // Initialize data here

      if (chartData.length === 0) {
        setNoDataMessage("No data available for the selected date range.");
        setChartData(null);
        return;
      } else {
        setNoDataMessage(""); // Clear the message if data is present
      }
      let timestamps = [];
      let data = [];

      // Process data based on the tag
      switch (tag) {
        case "OEE":
          timestamps = result.result.data.map((entry) => entry.timeStamp);
          data = result.result.data.map((entry) => parseFloat(entry.oee));
          break;
        case "AVAILABILITY":
          timestamps = result.result.data.map((entry) => entry.timeStamp);
          data = result.result.data.map((entry) =>
            parseFloat(entry.availability)
          );
          break;
        case "QUALITY":
          timestamps = result.result.data.map((entry) => entry.timeStamp);
          data = result.result.data.map((entry) => parseFloat(entry.quality));
          break;
        case "ENERGY":
          timestamps = result.result.data.map((entry) => entry.timeStamp);
          data = result.result.data.map((entry) => parseFloat(entry.energy));
          break;
        case "PERFORMANCE":
          timestamps = result.result.data.map((entry) => entry.timeStamp);
          data = result.result.data.map((entry) =>
            parseFloat(entry.performance)
          );
          break;
        default:
          // Handle unknown tag
          break;
      }

      // Update chartData state
      setChartData({
        labels: timestamps,
        data: data,
      });
      // Find min and max values
      const minValue = Math.min(...data).toFixed(2);
      const maxValue = Math.max(...data).toFixed(2);

      // Set min and max values in the state
      setMinValue(minValue);
      setMaxValue(maxValue);

      const minTimestamp = localizeTimestamp(
        findTimestamp(minValue, result.result.data)
      );
      const maxTimestamp = localizeTimestamp(
        findTimestamp(maxValue, result.result.data)
      );

      setMinTimestamp(minTimestamp);
      setMaxTimestamp(maxTimestamp);
    }

    // Fetch plant info based on plantI
    const plantInfoResult = await API.getAPI(
      baseURL + `/plants/get/${plantId}`
    );
    // console.log("plantInfoResult", plantInfoResult);
    if (
      plantInfoResult &&
      plantInfoResult.result &&
      plantInfoResult.result.data &&
      plantInfoResult.result.data.length > 0
    ) {
      const { plantName, plantAddress } = plantInfoResult.result.data[0];

      // console.log("Plant Name:", plantName);
      // console.log("Plant Address:", plantAddress);
      setPlantName(plantName);
      setPlantAddress(plantAddress);
    } else {
      // Handle the error case
      console.error("Failed to fetch plant information");
    }
  };

  useEffect(() => {
    if (selectedDate && selectedToDate) {
      fetchChartData();
    }
  }, [selectedDate, selectedToDate, tag]);

  const [buttonClicked, setButtonClicked] = useState(false);

  const handleClick = () => {
    setButtonClicked(true);
    childRef.current?.handlePDF();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupRef}>
        <p className="header">REPORTS</p>
        <div className="overall-container">
          <div className="plant-id-container">
            <p className="plant-tag-id">
              <strong>Plant ID:</strong>&nbsp;&nbsp;
              {PlantName}
            </p>
            <p className="tag-id">
              <strong>Tag:</strong>&nbsp;&nbsp;
              {tag}
            </p>
          </div>
          <div className="calenders-container">
            <div className="start-calender">
              <p>
                <strong>Start Date:</strong>&nbsp;&nbsp;
              </p>
              <div className="date-selectbox">
                <input
                  className="history-request-service-dates"
                  placeholder="From Date"
                  onClick={() => setShowCalendar(!showCalendar)}
                  value={
                    selectedDate
                      ? moment(calendarDate).format("MM/DD/YYYY")
                      : ""
                  }
                  readOnly
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
              </div>
            </div>
            <div className="start-calender">
              <p>
                <strong>End Date :</strong>&nbsp;&nbsp;
              </p>
              <div className="date-selectbox">
                <input
                  className="history-request-service-dates"
                  placeholder="To Date"
                  onClick={() => setShowToCalendar(!showToCalendar)}
                  value={
                    selectedToDate
                      ? moment(calendarToDate).format("MM/DD/YYYY")
                      : ""
                  }
                  readOnly
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
              </div>

              <div style={{ position: "absolute", left: "-9999px" }}>
                <Pdf
                  TagName={tag}
                  PlantName={plantName}
                  PlantAddress={plantAddress}
                  type="single"
                  ref={childRef}
                  FromDate={moment(form.FromDate).format("DD-MM-YYYY")}
                  ToDate={moment(form.ToDate).format("DD-MM-YYYY")}
                  minValue={minValue}
                  maxValue={maxValue}
                  minTimestamp={minTimestamp}
                  maxTimestamp={maxTimestamp}
                  chartData={chartData}
                />
              </div>
            </div>
          </div>
          <img
            className="onclick-download-icon"
            src={Download}
            title="Download Report"
            onClick={handleClick}
          />
        </div>

        {dateError && (
          <p className="error-text">End date cannot be before start date.</p>
        )}
        <div className="onclick-reports-table">
          <Table
            headers={[
              {
                id: "tag",
                label: "Title",
                width: 100,
                responsive: true,
                sortable: true,
                dataTestid: "title",
              },
              {
                id: "minValue",
                label: "Minimum Value",
                width: 50,
                responsive: true,
                sortable: false,
                dataTestid: "minValue",
              },
              {
                id: "maxValue",
                label: "Maximum Value",
                width: 50,
                responsive: true,
                sortable: false,
                dataTestid: "maxValue",
              },
            ]}
            data={[
              {
                tag: tag,
                minValue: `${minValue} | ${minTimestamp}`,
                maxValue: `${maxValue} | ${maxTimestamp}`,
              },
            ]}
            tableTitle={""}
            showPageEntryContainer={false}
            defaultOrderBy={"accountName"}
            defaultSortOrder={"asc"}
            userManage={true}
            editAction={() => {}}
            deleteAction={() => {}}
          />
        </div>
        <div className="popup-chart-container">
          {noDataMessage ? (
            <p className="no-data-message">{noDataMessage}</p>
          ) : (
            chartData && (
              <NewLineChart data={chartData.data} label={chartData.labels} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
export default DataCardPopup;
