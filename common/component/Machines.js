import "../Style/Machines.css";
import CommonMachineImg from "../../assets/images/MachinesCommon.jpg";
import { useState } from "react";
import Running from "../../assets/svg/running.svg";
import ChartComponent from "../Charts/ProgressBar.js";
import { machineData } from "../../common/dummyData/HomeJsonData.js";

import ProgressBarComponent from "../../common/component/MachineComp.js";
import ProcessBar from "../Charts/ProcessBar.js";
import { useNavigate } from "react-router-dom";
function Machines({ displayMachine }) {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "Running":
        return "#3A6A2E";
      // return "#12AA6C"; // Change this to the desired color for online status
      case "Stopped":
        return "#960909"; // Change this to the desired color for offline status
      // Add more cases for other statuses as needed
      default:
        return "gray"; // Default color
    }
  };
  const renderedProgressBarComponents =
    machineData.progressBarComponentsData.map((data, index) => {
      const status = data.status; // Change this according to your data structure

      // Define styles based on the status
      const machineStyles = {
        backgroundColor: getStatusColor(status), // getStatusColor is a function to determine color based on status
      };
      return (
        <div
          className="machine_1"
          key={`processbar_${index}`}
          style={machineStyles}
        >
          <ProgressBarComponent {...data} keys={`processbar_${index}`} />
        </div>
      );
    });

  const LineList = [
    {
      id: 1,
      name: "Packaging 1",
      product_type: "Cream",
      energy: "192kw",
      count: "2412 nos",
      batch_size: 6000,
      sku_type: "250ml",
    },
  ];
  const Machine = [
    {
      id: 1,
      name: "Mixture 1",
      product_type: "Cream",
      motor_rpm: "150 rpm",
      temperatur: "82",
      batch_size: "6000",
      mixing_time: "3 hours",
    },
    {
      id: 2,
      name: "Mixture 2",
      product_type: "Cream",
      motor_rpm: "150 rpm",
      temperatur: "82",
      batch_size: "70000",
      mixing_time: "3 hours",
    },
    {
      id: 3,
      name: "Mixture 3",
      product_type: "Cream",
      motor_rpm: "150 rpm",
      temperatur: "82",
      batch_size: "40000",
      mixing_time: "3 hours",
    },
    {
      id: 3,
      name: "Mixture 3",
      product_type: "Cream",
      motor_rpm: "150 rpm",
      temperatur: "82",
      batch_size: "40000",
      mixing_time: "3 hours",
    },
  ];
  const [machineCount, setMachineCount] = useState(
    Machine.length + LineList.length
  );
  const totalWorkingHours = 11; // Total working hours from 9 am to 8 pm
  const breakTimes = [30, 60, 60]; // Break times in minutes for each break
  const breakTimePercentage = breakTimes.reduce(
    (total, time) => total + (time / 60) * 100,
    0
  ); // Convert break times to percentage
  const runningTimePercentage = 100 - breakTimePercentage;
  const handleClick = (event, index, machine) => {
    console.log(machine);
    navigate("/home/live-report/" + machine.machineId);
  };
  // console.log("displayMachine ****", displayMachine);
  return (
    <div className="machines-container">
      <div className="machines-inner-container">
        {displayMachine?.map((machine, index) => (
          <div
            className={ machine?.machineStatus == "RUNNING"?"machines-content-container":machine?.machineStatus == "IDLE"?"machines-content-container":"machines-content-container-stopped"}
            onClick={(e) => handleClick(e, index, machine)}
          >
            <div className="machines-content-inner-container" key={index}>
              <div className="machine-image-container">
                <img src={CommonMachineImg} />
              </div>
              <div className="machine-naming-container">
                <div className="machine-name">{machine?.name}</div>
                <div className="machine-type">
                  <p className="machine-type-title">{machine?.dataPoints[0].title} : </p>
                  <p className="machine-type-sub-title"> {machine?.dataPoints[0]?.value}</p>
                </div>
                <div className="machine-energy">
                  <p className="machine-energy-title">{machine?.dataPoints[1].title} :</p>
                  <p className="machine-energy-sub-title">{machine?.dataPoints[1].value}</p>
                </div>
              </div>
              <div className="border-line"></div>
              <div className="machine-count-container">
                <div className="temp-content">
                  <p className="temp-content-title">{machine?.dataPoints[2].title}</p>
                  <span className="temp-content-sub-title">{machine?.dataPoints[2].value}</span>
                </div>
                <div className="performance-content">
                  <div className="batch">
                    <p  className="batch-title">{machine?.dataPoints[3].title}</p>
                    <span  className="batch-sub-title"> {machine?.dataPoints[3].value}</span>
                  </div>
                  <div className="type">
                    <p className="type-title">{machine?.dataPoints[4].title}</p>
                    <span className="type-sub-title">{machine?.dataPoints[4].value}</span>
                  </div>
                </div>
              </div>
              <div className="border-line"></div>
              <div className="machine-status-container">
                <div className="status-header">Line Status</div>
                <div
                  className={
                    machine?.machineStatus === "RUNNING"
                      ? "running-box":machine?.machineStatus === "STOPPED"?"stopped-box"
                      : "idle-box"
                  }
                >
                  <div className="image-containers">
                    <img src={Running} />
                  </div>
                  <div className="status-container">
                    <p className="status">{machine?.machineStatus}</p>
                    <p className="status-counter">{machine?.timeSpan}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {
         !displayMachine && (
          <div className="no-machine-avail">No Machines Available for this Plant</div>
         )
        }
      </div>
    </div>
  );
}
export default Machines;
{
  /* <div className="process-bar">
              <ProcessBar
                breakTime={breakTimePercentage}
                runningTime={runningTimePercentage}
              />
            </div> */
}
