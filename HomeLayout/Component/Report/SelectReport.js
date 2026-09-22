import "../../Style/Report.css";
import SelectBox from "../../../common/component/SelectBox";
import { useEffect, useRef, useState } from "react";
import ThroughPut from "../../../assets/svg/throughput.svg";
import BarChart from "../../../common/Charts/BarChart";
import {
  getThroghtData,
  getOeeData,
  getDowtimeData,
} from "../../../common/dummyData/ReportsData";
import apiData from "../../../common/dummyData/ReportsData";
import LineChart from "../../../common/Charts/LineChart";
import Button from "../../../common/component/ButtonField";

import { useNavigate } from "react-router-dom";
import Calender from "../../../common/component/Calendar";
import moment from "moment";
function Report() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");
  const [plants, setPlant] = useState("");
  const [reportLine, setReportLine] = useState("");
  const [lines, setLines] = useState("");
  const [levelLine, setLevelLines] = useState("");
  const [machines, setMachines] = useState("");
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarToDate, setCalendarToDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [previouseDate, setPreviouseDate] = useState(true);
  const [viewReport, setViewReport] = useState(true);
  const [nextDate, setNextDate] = useState(false);

  const plant = [
    { value: " ", label: "Select Your Plant" },
    { value: "plant 1", label: "plant 1" },
    { value: "plant 2", label: "plant 2" },
    { value: "plant 3", label: "plant 3" },
  ];
  const report_level = [
    { value: " ", label: "Select Report Level" },
    { value: "level 1", label: "level 1" },
    { value: "level 2", label: "level 2" },
    { value: "level 3", label: "level 3" },
  ];
  const line = [
    { value: " ", label: "Select Line" },
    { value: "line 1", label: "line 1" },
    { value: "line 2", label: "line 2" },
    { value: "line 3", label: "line 3" },
  ];
  const line_level = [
    { value: " ", label: "Select Line Level" },
    { value: "level 1", label: "level 1" },
    { value: "level 2", label: "level 2" },
    { value: "level 3", label: "level 3" },
  ];
  const mechine = [
    { value: " ", label: "Select Your Mechine" },
    { value: "machine 1", label: "machine  1" },
    { value: "machine  2", label: "machine  2" },
    { value: "machine  3", label: "machine  3" },
  ];
  const handleSelectChange = (event) => {
    setSelectedValue(event);
  };

  const charts = apiData?.main;
  const BarChartlabel = charts?.find((e) => e.type === "barChart#2/4")?.label;
  useEffect(() => {
    // const Barchartinterval = setInterval(() => {
    setBarChartdata(getThroghtData());
    setLineChartdata(getOeeData);
    setDowntimeChartdata(getDowtimeData);
    // });

    // return () => [clearInterval(Barchartinterval)];
  }, []);

  const [BarChartdata, setBarChartdata] = useState(
    charts?.find((e) => e.type === "barChart#2/4")?.data
  );

  //   Line chart
  const LineChartlabel = charts?.find((e) => e.type === "lineChart#3/3")?.label;
  const [DowntimeChartdata, setDowntimeChartdata] = useState(
    charts?.find((e) => e.type === "lineChart#2/4")?.data
  );
  const [LineChartdata, setLineChartdata] = useState(
    charts?.find((e) => e.type === "lineChart#3/3")?.data
  );
  const DowntimeChartStyles = {
    backgroundColor: "#E88035",
    borderColor: "#E88035",
    borderWidth: 3,
    borderRadius: 7,
  };

  const BarChartStyles = {
    backgroundColor: "#68B2A9",
    borderColor: "#68B2A9",
    borderWidth: 1,
    borderRadius: 7,
    barThickness: 50,
  };
  const DownChartlabel = charts?.find((e) => e.type === "lineChart#2/4")?.label;

  const handleCancel = () => {
    setViewReport(false);
    // Additional logic for cancel action
  };

  //   console.log("to ", showToCalendar);

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
    if (type == "From") {
      let tempDate = new Date(date);
      setCalendarDate(tempDate);
    } else {
      let tempDate = new Date(date);
      setCalendarToDate(tempDate);
    }
  };
  function dateChange(date, type) {
    if (type == "From") {
      if (new Date() < date) {
        date = new Date();
      }

      setCalendarDate(date);
      setSelectedDate(date);
      setShowCalendar(false);
      // dispatch(setLoading(true));
      // fetchHistory(date);
    } else {
      if (new Date() < date) {
        date = new Date();
      }
      setCalendarToDate(date);
      setSelectedToDate(date);
      setShowToCalendar(false);
      // dispatch(setLoading(true));
      // fetchHistory(date);
    }
  }

  // const monthToChange = (date) => {
  //   let tempDate = new Date(date);
  //   setCalendarToDate(tempDate);
  // };
  // function dateToChange(date) {
  //   if (new Date() < date) {
  //     date = new Date();
  //   }
  //   setCalendarToDate(date);
  //   setSelectedToDate(date);
  //   setShowToCalendar(false);
  //   // dispatch(setLoading(true));
  //   // fetchHistory(date);
  // }
  return (
    <div className="report-container">
      <div className="report-inner-container">
        <div className="report-selectbox-lists">
          <div className="selectbox">
            <SelectBox
              options={plant}
              value={plants}
              defaultText="Select Plant"
              handleChange={(event) => setPlant(event)}
              className="report-select"
            />
          </div>
          <div className="selectbox">
            <SelectBox
              options={report_level}
              value={reportLine}
              defaultText="Select Report Line"
              handleChange={(e) => {
                setReportLine(e);
              }}
              className="report-select"
            />
          </div>
          <div className="selectbox">
            <SelectBox
              options={line}
              value={lines}
              handleChange={(e) => {
                setLines(e);
              }}
              defaultText="Select Lines"
              className="report-select"
            />
          </div>
          <div className="selectbox">
            <SelectBox
              options={line_level}
              value={levelLine}
              handleChange={(e) => {
                setLevelLines(e);
              }}
              defaultText="Select Level Lines"
              className="report-select"
            />
          </div>
          <div className="selectbox">
            <SelectBox
              options={mechine}
              value={machines}
              handleChange={(e) => {
                setMachines(e);
              }}
              defaultText="Select Machines"
              className="report-select"
            />
          </div>
          <div className="selectbox">
            <input
              className="request-service-date "
              placeholder="Choose Date"
              onClick={() => setShowCalendar(!showCalendar)}
              value={
                selectedDate ? moment(calendarDate).format("MM/DD/YYYY") : ""
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
                      ? moment(new Date()).tz(localStorage.getItem("timeZone"))
                          ._d
                      : new Date()
                  }
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="selectbox">
            <input
              className="request-service-date "
              placeholder="Choose Date"
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
                      ? moment(new Date()).tz(localStorage.getItem("timeZone"))
                          ._d
                      : new Date()
                  }
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="charts-container">
          <div className="production-chart-container">
            <div className="production-chart">
              <div className="production-chart-title">
                <img src={ThroughPut} alt="Throughput" />
                <div className="title">Throughput (Rate of Production)</div>
              </div>
              <BarChart
                width={"98%"}
                height={"285px"}
                backgroundColor="#ABCEEB"
                data={BarChartdata}
                label={BarChartlabel}
                chartStyles={BarChartStyles}
              />
            </div>
            <div className="downtime-chart">
              <div className="downtime-chart-title">
                <img src={ThroughPut} alt="Throughput" />
                <div className="title">Machine Downtime Rate</div>
              </div>
              <LineChart
                width={"100%"}
                height="285px"
                chartStyles={DowntimeChartStyles}
                data={DowntimeChartdata}
                label={DownChartlabel}
              />
            </div>
          </div>
        </div>
        <div className="oee-chart-container">
          <div className="oee-chart-inner-container ">
            <div className="oee-chart-title">
              <img src={ThroughPut} alt="Throughput" />
              <div className="title">OEE - Yearly Performance Analysis</div>
            </div>
            <LineChart
              width={"100%"}
              height={"285px"}
              backgroundColor={"rgba(128, 181, 224, 0.49)"}
              data={LineChartdata}
              label={LineChartlabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Report;
