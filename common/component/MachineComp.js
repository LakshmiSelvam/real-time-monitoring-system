import React, { useState, useEffect } from "react";
import "../Style/MachineComp.css";
import CommonMachineImg from "../../assets/images/MachinesCommon.jpg";

import ChartComponent from "../Charts/ProgressBar.js";
//import { formatTime } from "./TimeUtils";
import ProcessBar from "../Charts/ProcessBar.js";

import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../Style/Machines.css";

const MachineComponent = ({
  machineDetails,
  processBar,
  onClick,
  status,
  keys,
  progressData,
}) => {
  const navigate = useNavigate();
  // Function to generate initial random times
  const generateRandomTimes = () => {
    const initialTimes = [];
    for (let i = 0; i < 5; i++) {
      const randomTime = moment()
        .startOf("day")
        //.add(Math.floor(Math.random() * 0), "hours")
        .add(Math.floor(Math.random() * 60), "minutes")
        .add(Math.floor(Math.random() * 60), "seconds")
        .format("00:mm:ss");
      initialTimes.push(randomTime);
    }
    return initialTimes;
  };

  // Function to generate initial times or retrieve from local storage
  const generateOrRetrieveRandomTimes = () => {
    const storedTimes = localStorage.getItem("randomTimes");
    return storedTimes ? JSON.parse(storedTimes) : generateRandomTimes();
  };

  // State to store and update random times
  const [randomTimes, setRandomTimes] = useState(() =>
    generateOrRetrieveRandomTimes()
  );

  // Function to increment seconds
  const incrementSeconds = () => {
    setRandomTimes((prevTimes) =>
      prevTimes.map((time) =>
        moment(time, "00:mm:ss").add(1, "seconds").format("00:mm:ss")
      )
    );
  };

  // Function to increment minutes
  const incrementMinutes = () => {
    setRandomTimes((prevTimes) =>
      prevTimes.map((time) =>
        moment(time, "00:mm:ss").add(1, "minutes").format("00:mm:ss")
      )
    );
  };

  // Effect to start the interval for incrementing seconds and minutes
  useEffect(() => {
    const interval = setInterval(() => {
      incrementSeconds(); // Update seconds every second
    }, 1000);

    const minuteInterval = setInterval(() => {
      incrementMinutes(); // Update minutes every 60 seconds
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(minuteInterval);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Save random times to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("randomTimes", JSON.stringify(randomTimes));
  }, [randomTimes]);

  const processBarArr = processBar.map((e, index) => (
    <div className="processbar-main" key={`${e.title}_${index}`}>
      <span className="processbar-text">{e.title}</span>
      <ProcessBar apiResponse={e.value} key={`Process_Bar_${index}`} />
    </div>
  ));

  const machineDetailsContent = (
    <div className="id_naming" key={`main_machine_${keys}`}>
      <div className="machine_naming">{machineDetails.name}</div>
      <div className="ids_bottom_split">
        <span>
          <strong>ID:</strong> {machineDetails.id}
        </span>
        <span>
          <strong>Type:</strong> {machineDetails.type}
        </span>
      </div>
    </div>
  );

  const machineTimes = randomTimes.filter(
    (time, index) => index === machineDetails.index
  );

  const displayTimes = machineTimes.map((time, index) => (
    <div key={index}>{time}</div>
  ));

  // const handleComponentClick = (event) => {
  //   localStorage.setItem("status", event);
  //   navigate("/home/live-report");
  // };

  return (
    <div className="machines-container">
      <div className="machines-inner-container">
        <div className="machines-content-container">
          <div className="machine-image-container"></div>
          <div className="machine-naming-container"></div>
          <div className="machine-count-container"></div>
          <div className="machine-status-container"></div>
        </div>
      </div>
    </div>
    // <div className="overall-machine-component">
    //   {machineTimes.map((d, index) => (
    //     <React.Fragment key={index}>
    //       <div
    //         className="top_half"
    //         value={index}
    //         onClick={(e) => handleComponentClick(status)}
    //       >
    //         <div className="left_split">
    //           <img className="main_machine_img" src={CommonMachineImg} alt="" />
    //         </div>
    //         <div className="middle_split">
    //           {machineDetailsContent}
    //           <div className="values_reading_bars">{processBarArr}</div>
    //         </div>
    //         <div className="right_split">
    //           <p>{displayTimes}</p>
    //           <p>{status}</p>
    //         </div>
    //       </div>
    //       <div className="bottom_half">
    //         <ChartComponent
    //           barData={{ progressData }}
    //           keys={keys}
    //           machineId={machineDetails.id}
    //         />
    //       </div>
    //     </React.Fragment>
    //   ))}
    // </div>
  );
};

export default MachineComponent;
