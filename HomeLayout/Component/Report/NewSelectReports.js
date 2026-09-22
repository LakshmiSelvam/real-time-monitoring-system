import "../../Style/NewReports.css";
import SelectBox from "../../../common/component/SelectBox";
import { useEffect, useRef, useState } from "react";
import GraphLayout from "../../../common/component/GraphLayout";
import { useNavigate, useParams } from "react-router-dom";
import Calender from "../../../common/component/Calendar";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import * as API from "../../../common/api/index.js";
import Area from "../../../common/Charts/Area";
import Table from "../../../common/component/Table";
import {
  setLoading,
  setSnackData,
  setPlantList,
  setMachineList,
  setLineList,
} from "../../../redux/action/userAction";
import URL from "../../../common/api/constantURL.js";

import Camera from "../../../assets/images/camera.png";
import Download from "../../../assets/images/download.png";
import Pdf from "./Pdf.js";
import refresh from "../../../assets/images/refresh.png"
import MuliLineChart from "../../../common/Charts/MultiLineChart.js"
function NewReport() {
  const childRef = useRef(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarToDate, setCalendarToDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [previouseDate, setPreviouseDate] = useState(true);
  const [viewReport, setViewReport] = useState(false);
  const [nextDate, setNextDate] = useState(false);
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const plantList = useSelector((state) => state.userReducer.plantList);
  const lineList = useSelector((state) => state.userReducer.lineList);
  const machineList = useSelector((state) => state.userReducer.machineList);
  const indeptMachine = useSelector((state) => state.userReducer.indeptMachine);
  const [messageIndex, setMessageIndex] = useState(0);
  const [filteredLines, setFilteredLines] = useState([]);
  const [filteredLineLevels, setFilteredLineLevels] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [error,setError] = useState('')
  const [form, setForm] = useState({
    PlantName: "",
    LineName: "",
    MachineName: "",
    PlantLevel: "INDEPTH",
    LineLevel: "",
    FromDate: selectedDate,
    ToDate: selectedToDate,
  });
  const [OEEGraph, setOEEGraph] = useState("");
  const [downTimeGraph, setDownTimeGraph] = useState("");
  const [qualityGraph, setQualityGraph] = useState("");
  const [powerGraph, setPowerGraph] = useState("");

  const plantsWithLabels = plantList.map((plant) => {
    return {
      ...plant,
      value: plant.plantName,
      label: plant.plantName,
      id: plant.plantId,
	  address:plant.plantAddress
    };
  });
  // console.log("dfghgfdsdf", plantsWithLabels);
 
  const linesWithLabels = lineList.map((line) => {
    return {
      ...line,
      value: line.lineName,
      label: line.lineName,
      id: line.lineId,
    };
  });
  const machinesWithLabels = machineList.map((machine) => {
    return {
      ...machine,
      value: machine.machineName,
      label: machine.machineName,
      id: machine.machineId,
    };
  });
  const plantReport_level = [
    {
      id: "INDEPTH",
      value: "INDEPTH",
      label: "Plant Analysis",
    },
    {
      id: "OVERALL",
      value: "OVERALL",
      label: "Plant Overview",
    },
  ];
  const lineReport_level = [
    {
      id: "INDEPTH",
      value: "INDEPTH",
      label: "Line Analysis",
    },
    {
      id: "OVERALL",
      value: "OVERALL",
      label: "Line Overview",
    },
  ];

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    fetchLines();
  }, []);

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (dateError) {
      setMessageIndex(7);
    }
  }, [dateError]);

  const fetchPlants = async () => {
    let result = await API.getAPI(baseURL + "/plants/get");
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      // dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
        dispatch(setPlantList(result.result.data));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
  };

  const fetchLines = async () => {
    let result = await API.getAPI(baseURL + "/lines/get");
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      // dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
        dispatch(setLineList(result.result.data));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
  };

  const fetchMachines = async () => {
    let result = await API.getAPI(baseURL + "/machine/get");
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      // dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
        dispatch(setMachineList(result.result.data));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
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
      setForm({
        ...form,
        FromDate: date,
      });
      setCalendarDate(date);
      setSelectedDate(date);
      setShowCalendar(false);
      setViewReport(false);
      setDateError(false);
      setError("")
    } else {
      // toDate should be above fromDate
      if (date < form.FromDate) {
        // If so, set error message and disable output
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
  useEffect(() => {
    // if (form.PlantName &&  selectedDate && selectedToDate ||  form.PlantName && form.LineName &&  form.MachineName  && selectedDate && selectedToDate) {
    if (form.PlantName &&  selectedDate && selectedToDate && !form.LineName && !form.MachineName) {
        setViewReport(true);
    }
    else if(form.PlantName && form.LineName && selectedDate && selectedToDate && form.MachineName){
      setViewReport(true);
    }
    // else if(form.PlantName &&  selectedDate && selectedToDate && form.LineName && !form.MachineName){
    //   setError("Should Select the Machine")
    // }
    // else if(form.PlantName && form.LineName && selectedDate && selectedToDate && !form.MachineName){
    //   setViewReport(false);
    // } 
    else {
      setViewReport(false);
    }
  }, [form, selectedDate, selectedToDate]);

  useEffect(() => {
    const fetchReport = async () => {
      if (viewReport) {
        const keyMap = {
          PlantName: "plantId",
          PlantLevel: "plantReportLevel",
          LineName: "lines",
          LineLevel: "lineReportLevel",
          MachineName: "machines",
          FromDate: "startDate",
          ToDate: "endDate",
        };

        let body = {};
       
        if(!form.LineName){
          form.LineLevel ="OVERALL"
        }
        if(form.LineName){
          form.LineLevel ="INDEPTH"
        }
        
        for (const key in form) {
          if (form[key] && keyMap[key]) {
            body[keyMap[key]] = form[key];
          }
        }
      
        if(form.LineName && !form.MachineName){
          setError("Should Select the Machine")
        }
        else{
        let result = await API.postAPI(baseURL + URL.report, body);
        dispatch(setLoading(true));
        if (result.fetchStatus === "failure") {
          dispatch(setLoading(false));
        } else {
          if (result.result.statusCode === 200) {
            setApiData(result.result.data);
            updateLocalState(result.result.data);
          } else {
            dispatch(setLoading(false));
          }
        }
        }
      }
    };
    fetchReport();
  }, [
    viewReport,
    selectedDate,
    selectedToDate,
    form.PlantName,
    form.LineName,
    form.MachineName,
  ]);

  const [oEEData, setOEEData] = useState([]);
  const [oEELable, setOEELables] = useState([]);
  const [oEETitle, setOEETitle] = useState("");
  const [downTimeData, setDownTimeData] = useState([]);
  const [downTimeLable, setDownTimeLables] = useState([]);
  const [downTimeTitle, setDownTimeTitle] = useState("");
  const [qualityData, setQualityData] = useState([]);
  const [qualityLable, setQualityLables] = useState([]);
  const [qualityTitle, setQualityTitle] = useState("");
  const [powerData, setPowerData] = useState([]);
  const [powerLable, setPowerLables] = useState([]);
  const [powerTitle, setPowerTitle] = useState("");
  const updateLocalState = (data) => {
    data.forEach((item) => {
      switch (item.title) {
        case "OEE":
          setOEEGraph(item.value || []);
          setOEETitle(item.title || "");
          break;
        case "Downtime":
          setDownTimeGraph(item.value || []);
          setDownTimeTitle(item.title || "");
          break;
        case "Quality":
          setQualityGraph(item.value || []);
          setQualityTitle(item.title || "");
          break;
        case "Power Consumptions":
          setPowerGraph(item.value || []);
          setPowerTitle(item.title || "");
          break;
        default:
          break;
      }
    });
  };

  useEffect(() => {
    if (OEEGraph) {
      const timestamps = OEEGraph?.map((entry) =>
        moment(entry.timeStamp).format("DD-MM-YYYY hh:mm:ss")
      );
      const oeeValues = OEEGraph?.map((entry) =>
        parseFloat(entry.value ? entry.value : entry.oee)
      );
      setOEELables(timestamps);
      setOEEData(oeeValues);
    }
  }, [OEEGraph]);
  useEffect(() => {
    if (downTimeGraph) {
      const timestamps = downTimeGraph?.map((entry) =>
        moment(entry.timeStamp).format("DD-MM-YYYY hh:mm:ss")
      );
      const oeeValues = downTimeGraph?.map((entry) =>
        parseFloat(entry.value ? entry.value : entry.downtime)
      );
      setDownTimeLables(timestamps);
      setDownTimeData(oeeValues);
    }
  }, [downTimeGraph]);
  useEffect(() => {
    if (qualityGraph) {
      const timestamps = qualityGraph?.map((entry) =>
        moment(entry.timeStamp).format("DD-MM-YYYY hh:mm:ss")
      );
      const oeeValues = qualityGraph?.map((entry) =>
        parseFloat(entry.value ? entry.value : entry.quality)
      );
      setQualityLables(timestamps);
      setQualityData(oeeValues);
    }
  }, [qualityGraph]);
  useEffect(() => {
    if (powerGraph) {
      const timestamps = powerGraph?.map((entry) =>
        moment(entry.timeStamp).format("DD-MM-YYYY hh:mm:ss")
      );
      const oeeValues = powerGraph?.map((entry) =>
        parseFloat(entry.value ? entry.value : entry.powerConsumptions)
      );
      setPowerLables(timestamps);
      setPowerData(oeeValues);
    }
  }, [powerGraph]);

  const handleChange = (event) => {
    setForm({
      ...form,
      PlantName: [event],
    });
    setMessageIndex(1);
    setError("")
  };

  const handleLineChange = (event) => {
    setForm({
      ...form,
      LineName: [event],
    });
    setMessageIndex(4);
    setError("")
  };

  const handlePlantLevelChange = (value) => {
    setForm({
      ...form,
      PlantLevel: value,
      LineName: "",
      LineLevel: "",
      MachineName: "",
    });
    if (value === "OVERALL") {
      setFilteredLines([]);
      setFilteredLineLevels([]);
      setFilteredMachines([]);
      setMessageIndex(2);
    } else if (value === "INDEPTH") {
      setMessageIndex(3);
    }
  };

  useEffect(() => {
    let filteredLines;
    if (form.PlantLevel != "OVERALL") {
      filteredLines = linesWithLabels.filter((line) =>
        form.PlantName.includes(line.plantId)
      );
    } else {
      filteredLines = [];
    }
    setFilteredLines(filteredLines);
    setFilteredLineLevels(lineReport_level);
  }, [form.PlantLevel, form.PlantName]);

  const handleLineLevelChange = (value) => {
    setForm({
      ...form,
      LineLevel: value,
      MachineName: "",
    });
    if (value === "OVERALL") {
      setFilteredMachines([]);
      setMessageIndex(2);
    } else if (value === "INDEPTH") {
      // setFilteredMachines(machinesWithLabels);
      setMessageIndex(5);
    }
  };
  useEffect(() => {
    let filteredMachines;
    if (form.LineLevel != "OVERALL") {
      filteredMachines = machinesWithLabels.filter((machine) =>
        form.LineName.includes(machine.lineId)
      );
    } else {
      filteredMachines = [];
    }
    setFilteredMachines(filteredMachines);
  }, [form.PlantLevel, form.PlantName, form.LineName, form.LineLevel]);

  const handleMachineChange = (event) => {
    setForm({
      ...form,
      MachineName: [event],
    });
    setMessageIndex(2);
    setError("")
  };

  const [selectedDetails, setSelectedDetails] = useState({
    PlantName: "",
    // PlantLevel: "",
    LineName: "",
    // LineLevel: "",
    MachineName: "",
    FromDate: "",
    ToDate: "",
  });

  // Function to update selected details
  const updateSelectedDetails = () => {
    const findPlant = (id) =>
      plantList.find((plant) => plant.plantId === id)?.plantName;
    const findLine = (id) =>
      lineList.find((line) => line.lineId === id)?.lineName;
    const findMachines = (ids) =>
      machineList
        .filter((machine) => ids.includes(machine.machineId))
        .map((machine) => machine.machineName)
        .join(", ");

    setSelectedDetails({
      ...selectedDetails,
      PlantName: findPlant(form.PlantName[0]) ?? selectedDetails.PlantName,
      LineName: findLine(form.LineName[0]) ?? selectedDetails.LineName,
      MachineName:
        findMachines(form.MachineName) ?? selectedDetails.MachineName,
      // PlantLevel: form.PlantLevel,
      // LineLevel: form.LineLevel,
      FromDate: selectedDate,
      ToDate: selectedToDate,
    });
  };

  useEffect(() => {
    updateSelectedDetails();
  }, [form, selectedDate, selectedToDate]);

  // space in b/w updated labels like PlantName = Plant Name
  const formatLabel = (key) => {
    const labelWithSpace = key.replace(/([A-Z])/g, " $1").trim();
    return labelWithSpace.charAt(0).toUpperCase() + labelWithSpace.slice(1);
  };

  // Function to find the minimum value for a title
  const findMinValue = (item) => {
    if (!item.value || item.value.length === 0) return "";
    const values = item.value.map((entry) => {
      let value;
      switch (item.title) {
        case "OEE":
          value = parseFloat(entry.oee || entry.value);
          //   console.log("entry.oee || entry.value", value);
          break;
        case "Downtime":
          value = parseFloat(entry.downtime || entry.value);
          break;
        case "Quality":
          value = parseFloat(entry.quality || entry.value);
          break;
        case "Power Consumptions":
          value = parseFloat(entry.powerConsumptions || entry.value);
          break;
        default:
          value = 0;
      }
      return isNaN(value) ? 0 : value;
    });
    
    return Math.min(...values).toFixed(2);
  };

  const findMinDate = (item) => {
    if (!item.value || item.value.length === 0) return "";
    const values = item.value.map((entry) => {
      let value;
      switch (item.title) {
        case "OEE":
          value = parseFloat(entry.oee || entry.value);
          break;
        case "Downtime":
          value = parseFloat(entry.downtime || entry.value);
          break;
        case "Quality":
          value = parseFloat(entry.quality || entry.value);
          break;
        case "Power Consumptions":
          value = parseFloat(entry.powerConsumptions || entry.value);
          break;
        default:
          value = 0;
      }
      return isNaN(value) ? Infinity : value; // Replace NaN with Infinity for comparison
    });
  
    const minValue = Math.min(...values);
    const minIndex = values.indexOf(minValue);
    const minDate = (item.value[minIndex]).timeStamp
    return minDate
  };
  const findMaxDate = (item) => {
    if (!item.value || item.value.length === 0) return "";
    const values = item.value.map((entry) => {
      let value;
      switch (item.title) {
        case "OEE":
          value = parseFloat(entry.oee || entry.value);
          break;
        case "Downtime":
          value = parseFloat(entry.downtime || entry.value);
          break;
        case "Quality":
          value = parseFloat(entry.quality || entry.value);
          break;
        case "Power Consumptions":
          value = parseFloat(entry.powerConsumptions || entry.value);
          break;
        default:
          value = 0;
      }
      return isNaN(value) ? Infinity : value; // Replace NaN with Infinity for comparison
    });
  
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);
    const maxDate = (item.value[maxIndex]).timeStamp
    return maxDate
  };

  // Function to find the maximum value for a title
  const findMaxValue = (item) => {
    if (!item.value || item.value.length === 0) return ""; // No values
    const values = item.value.map((entry) => {
      let value;
      switch (item.title) {
        case "OEE":
          value = parseFloat(entry.oee || entry.value);
          break;
        case "Downtime":
          value = parseFloat(entry.downtime || entry.value);
          break;
        case "Quality":
          value = parseFloat(entry.quality || entry.value);
          break;
        case "Power Consumptions":
          value = parseFloat(entry.powerConsumptions || entry.value);
          break;
        // Add cases for other titles as needed
        default:
          value = 0;
      }
      return isNaN(value) ? 0 : value;
    });
    return Math.max(...values).toFixed(2);
  };

  // Function to find the start date of data and convert it to local time
  const findStartDate = (item) => {
    if (!item.value || item.value.length === 0) return ""; // No values
    const timestamps = item.value.map((entry) => new Date(entry.timeStamp));
    const minTimestamp = new Date(Math.min(...timestamps));
    return minTimestamp
      ? moment(minTimestamp).local().format("MM/DD/YYYY HH:mm:ss")
      : "";
  };

  // Function to find the end date of data and convert it to local time
  const findEndDate = (item) => {
    if (!item.value || item.value.length === 0) return ""; // No values
    const timestamps = item.value.map((entry) => new Date(entry.timeStamp));
    const maxTimestamp = new Date(Math.max(...timestamps));
    return maxTimestamp
      ? moment(maxTimestamp).local().format("MM/DD/YYYY HH:mm:ss")
      : "";
  };


  const foundPlant = (PlantName) => {
    const selectedPlant = plantsWithLabels.find(
      (plant) => plant.id === PlantName[0]
    );
    const plantName = selectedPlant ? selectedPlant.value : "";
    return plantName;
  };
  const foundPlantAddress = (PlantName) => {
    const selectedPlant = plantsWithLabels.find(
      (plant) => plant.id === PlantName[0]
    );
    const plantName = selectedPlant ? selectedPlant.address : "";
    return plantName;
  };
  const foundLine = (LineName) => {
    const selectedPlant = linesWithLabels.find(
      (plant) => plant.id === LineName[0]
    );
    const lineName = selectedPlant ? selectedPlant.value : "";
    return lineName;
  };
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleClick = () => {
    setButtonClicked(true);
    childRef.current?.handlePDF();
  };
 const handleRefresh=()=>{
  window.location.reload()
 }

//  OEE graph
 const lineData = {}; 
 let label = [];
 const graph_datas = [];
 
 if (form.LineLevel === 'OVERALL' && OEEGraph) {
     OEEGraph.forEach(item => {
         label.push(item.timeStamp); 
         if (!lineData[item.lineId]) {
             lineData[item.lineId] = [];
         }
         lineData[item.lineId].push(parseFloat(item.value));
     });
 
     Object.keys(lineData).forEach(lineId => {
         graph_datas.push(lineData[lineId]);
     });
 }

 //  quality graph
 const qualityDatas = {}; 
 let qualityLabel = [];
 const quality_graph_data = [];
 
 if (form.LineLevel === 'OVERALL' && qualityGraph ) {
    qualityGraph.forEach(item => {
        qualityLabel.push(item.timeStamp); 
         if (!qualityDatas[item.lineId]) {
            qualityDatas[item.lineId] = [];
         }
         qualityDatas[item.lineId].push(parseFloat(item.value));
     });
 
     Object.keys(qualityDatas).forEach(lineId => {
        quality_graph_data.push(qualityDatas[lineId]);
     });
 }

//  power consumpution
const powerDatas = {}; 
let powerLabel = [];
const power_graph_data = [];

if (form.LineLevel === 'OVERALL' && powerGraph ) {
    powerGraph.forEach(item => {
        powerLabel.push(item.timeStamp); 
        if (!powerDatas[item.lineId]) {
            powerDatas[item.lineId] = [];
        }
        powerDatas[item.lineId].push(parseFloat(item.value));
    });

    Object.keys(powerDatas).forEach(lineId => {
        power_graph_data.push(powerDatas[lineId]);
    });
}
const localizeTimestamp = (timestamp) => {
  if (!timestamp) return ""; // Added check for undefined or null timestamp
  const timezone = localStorage.getItem("timeZone");
  const dateInUTC = new Date(timestamp);
  return dateInUTC.toLocaleString("en-US", {
    timeZone: timezone,
    day:"2-digit",
    month:"short",
    year:"numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

  return (
    <div className="report-container">
      <div className="report-inner-container">
        <div className="report-selectbox-lists">
          <div className="selectbox">
            <SelectBox
              options={plantsWithLabels}
              value={form.PlantName}
              defaultText="Select Plant"
              handleChange={(event) => handleChange(event)}
              className="report-select"
            />
          </div>
     
          <div className="selectbox">
            <SelectBox
              options={filteredLines}
              value={form.LineName}
              handleChange={(e) => handleLineChange(e)}
              defaultText="Select Lines"
              className="report-select"
              disabled={form.PlantLevel === "Overall plant report"}
            />
          </div>
       
          <div className="selectbox">
            <SelectBox
              options={filteredMachines}
              value={form.MachineName}
              handleChange={(e) => handleMachineChange(e)}
              defaultText="Select Machines"
              className="report-select"
              disabled={
                form.PlantLevel === "Overall plant report" ||
                form.LineLevel === "Overall line report"
              }
            />
          </div>

          <div className="selectbox">
            <input
              className="history-request-service-date "
              placeholder="From Date"
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
              className="history-request-service-date "
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
          <img
            src={refresh}
			title="Refresh"
            onClick={handleRefresh}
            style={{ cursor: "pointer",}}
          />
          <img
            src={Download}
			title="Download"
            onClick={handleClick}
            style={{ cursor: "pointer",marginLeft:'12px'  }}
          />
        
        </div>
        {form.LineLevel == 'OVERALL'?
          <div style={{ position: "absolute", left: "-9999px" }}>
          <Pdf
            type="multiple"
            ref={childRef}
			linesWithLabels = {linesWithLabels}
            PlantName={foundPlant(form.PlantName)}
			PlantAddress={foundPlantAddress(form.PlantName)}
            LineName={foundLine(form.LineName)}
            MachineName={form.MachineName}
            PlantLevel={form.PlantLevel}
            LineLevel={form.LineLevel}
            oEETitle={"OEE"}
            oEELable={label}
            oEEData={graph_datas}
			labels={label}
            qualityTitle={"QUALITY"}
            qualityLable={qualityLabel}
            qualityData={quality_graph_data}
            powerTitle={"POWER CONSUMPTIONS"}
            powerLable={powerLabel}
            powerData={power_graph_data}
            apiData={apiData ? apiData : ""}
            FromDate={moment(form.FromDate).format("DD-MM-YYYY")}
            ToDate={moment(form.ToDate).format("DD-MM-YYYY")}
          />
        </div>
        :
        <div style={{ position: "absolute", left: "-9999px" }}>
          <Pdf
          type="single"
          ref={childRef}
          PlantName={foundPlant(form.PlantName)}
    	PlantAddress={foundPlantAddress(form.PlantName)}
          LineName={foundLine(form.LineName)}
          MachineName={form.MachineName}
          PlantLevel={form.PlantLevel}
          LineLevel={form.LineLevel}
          oEETitle={oEETitle}
          oEELable={oEELable}
          oEEData={oEEData}
          downTimeTitle={downTimeTitle}
          downTimeLable={downTimeLable}
          downTimeData={downTimeData}
          qualityTitle={qualityTitle}
          qualityLable={qualityLable}
          qualityData={qualityData}
          powerTitle={powerTitle}
          powerLable={powerLable}
          powerData={powerData}
          apiData={apiData ? apiData : ""}
          FromDate={moment(form.FromDate).format("DD-MM-YYYY")}
          ToDate={moment(form.ToDate).format("DD-MM-YYYY")}
          />
        </div>
        }
        <div id="graph-data">
          <div className="updated-inputs">
            {Object.entries(selectedDetails).map(([key, value]) => {
              if (value !== "") {
                const className =
                  key === "FromDate" || key === "ToDate"
                    ? "from-date"
                    : "default";
                const label = formatLabel(key);
                const formatedValue =
                  key === "FromDate" || key === "ToDate"
                    ? moment(value).format("MM/DD/YYYY")
                    : value;

                return (
                  <p key={key} className={className}>
                    {label}: {formatedValue}
                  </p>
                );
              }
              return null;
            })}
          </div>
		  {/* <h2>Summary</h2> */}
		  {apiData && apiData.length > 0 ? (
            <div className="reports-table">
              <Table
                headers={[
                  {
                    id: "title",
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
                data={apiData.map((item) => ({
                  title: item.title,
                  minValue:findMinValue(item)+' @ '+localizeTimestamp(findMinDate(item)),
                  maxValue: findMaxValue(item) + ' @ ' + localizeTimestamp(findMaxDate(item)),
                }))}
                tableTitle={""}
                showPageEntryContainer={false}
                defaultOrderBy={"accountName"}
                defaultSortOrder={"asc"}
                userManage={true}
                editAction={() => {}}
                deleteAction={() => {}}
              />
            </div>
          ) : (
            ""
          )}
          {viewReport &&  (
            apiData && apiData.length>0?
            <div className="charts-container">
            {form.LineLevel == 'OVERALL'?
            <>
              <div className="history-status-mid-container">
                <h1 className="graph-title">OEE</h1>
                <MuliLineChart 
                
                  data={graph_datas}
                  labels={label}
                  localizedTimeLabel={true}
				  linesWithLabels = {linesWithLabels}
                />
              </div>
              <div className="history-status-mid-container">
                <h1 className="graph-title">Quality</h1>
                    <MuliLineChart 
                    data={quality_graph_data}
                    labels={qualityLabel}
                    localizedTimeLabel={true}
					          linesWithLabels = {linesWithLabels}
                    />
                </div>
                <div className="history-status-mid-container">
                <h1 className="graph-title">Power Consumptions</h1>
                <MuliLineChart  
                  data={power_graph_data}
                  labels={powerLabel}
                  localizedTimeLabel={true}
				  linesWithLabels = {linesWithLabels}
                />
                </div>     
              </>:
              <>
              <div className="history-status-mid-container">
                <GraphLayout
				          fileType="report"
                  type="LINE_CHART"
                  size="4/4"
                  title={oEETitle}
                  label={oEELable}
                  data={oEEData}        
                  localizedTimeLabel={true}
                  xAxisColor="#FFFFFF"
                  yAxisColor="#FFFFFF"
                  borderColor="#127EE0"
                  
                />        
              </div>
              <div className="history-status-mid-container">
              <GraphLayout
                  fileType="report"
                  type="LINE_CHART"
                  title={qualityTitle}
                  size="4/4"
                  label={qualityLable}
                  data={qualityData}
                  xAxisColor="#FFFFFF"
                  yAxisColor="#FFFFFF"
                  borderColor="#127EE0"
                  localizedTimeLabel={true}
                />
              </div>
              <div className="history-status-mid-container">
              <GraphLayout
                  fileType="report"
                  type="LINE_CHART"
                  title={powerTitle}
                  size="4/4"
                  label={powerLable}
                  data={powerData}
                  xAxisColor="#FFFFFF"
                  yAxisColor="#FFFFFF"
                  borderColor="#127EE0"
                  localizedTimeLabel={true}
                />
              </div>
              </>
              }
            </div>
            :<div className="no-data">{error?error:"No Data Available for Given Date"}</div>
          )}
        
        </div>
		{/* {form.LineLevel == 'OVERALL'?
		<Pdf
          type="multiple"
            ref={childRef}
            PlantName={foundPlant(form.PlantName)}
			PlantAddress={foundPlantAddress(form.PlantName)}
            LineName={foundLine(form.LineName)}
            MachineName={form.MachineName}
            PlantLevel={form.PlantLevel}
            LineLevel={form.LineLevel}
            oEETitle={"OEE"}
            oEELable={label}
            oEEData={graph_datas}
			labels={label}
            qualityTitle={"QUALITY"}
            qualityLable={qualityLabel}
            qualityData={quality_graph_data}
            powerTitle={"POWER CONSUMPTIONS"}
            powerLable={powerLabel}
            powerData={power_graph_data}
            apiData={apiData ? apiData : ""}
            FromDate={moment(form.FromDate).format("DD-MM-YYYY")}
            ToDate={moment(form.ToDate).format("DD-MM-YYYY")}
          />:
		  <Pdf
          type="single"
            ref={childRef}
            PlantName={foundPlant(form.PlantName)}
			PlantAddress={foundPlantAddress(form.PlantName)}
            LineName={foundLine(form.LineName)}
            MachineName={form.MachineName}
            PlantLevel={form.PlantLevel}
            LineLevel={form.LineLevel}
            oEETitle={oEETitle}
            oEELable={oEELable}
            oEEData={oEEData}
            downTimeTitle={downTimeTitle}
            downTimeLable={downTimeLable}
            downTimeData={downTimeData}
            qualityTitle={qualityTitle}
            qualityLable={qualityLable}
            qualityData={qualityData}
            powerTitle={powerTitle}
            powerLable={powerLable}
            powerData={powerData}
            apiData={apiData ? apiData : ""}
            FromDate={moment(form.FromDate).format("DD-MM-YYYY")}
            ToDate={moment(form.ToDate).format("DD-MM-YYYY")}
          />
		  } */}
      </div>
    </div>
  );
}
export default NewReport;
