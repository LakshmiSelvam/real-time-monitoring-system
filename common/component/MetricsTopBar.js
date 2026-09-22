import { useState, useEffect } from "react";
import { formatTime } from "../../common/component/TimeUtils";
import "../Style/MetricsTopBar.css";
import OeeSvg from "../../assets/svg/oee-topbar-small.svg";
import PMaintSvg from "../../assets/svg/plnedmaint-topbar-small.svg";
import MtbfSvg from "../../assets/svg/mtbf-topbar-small.svg";
import ScrateSvg from "../../assets/svg/scrate-topbar-small.svg";
import MdrSvg from "../../assets/svg/mdr-topbar-small.svg";

const MachineStatusCard = ({ statusData }) => {
  // console.log("statusData", JSON.stringify(statusData));
  const { status, running, productId, value, iconId, title } = statusData;

  const [currentTime, setCurrentTime] = useState(new Date());

  // Function to update the time
  const updateCurrentTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const intervalId = setInterval(updateCurrentTime, 10000);
    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []); // Emp

  const machineStatusClass =
    status === "ON"
      ? "metrics-topbar-main metrics-bar-status status-green"
      : "metrics-topbar-main metrics-bar-status status-red"; // Assuming there is a class for "OFF" status, change it accordingly

  const machineStatusView = (
    <div className={machineStatusClass}>
      <div className="metrics-topbar-status-title">
        Machine Status : {status ?? "Unknown"}
      </div>
      <div className="metrics-topbar-status-data">Running: 3hrs 17 min</div>
      <div className="metrics-topbar-status-data">
        ProductId: {productId ?? "Unknown"}
      </div>
    </div>
  );

  return machineStatusView;
};

const MetricsTopBar = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  const cardsView = [];

  const machineStatusData = data[data.length - 1]; // Get the last item without modifying the array
  const icons = [OeeSvg, PMaintSvg, MtbfSvg, ScrateSvg, MdrSvg];

  for (let index = 0; index < data.length - 1; index++) {
    const e = data[index];
    const svgName = icons[index];

    cardsView.push(
      <div className="metrics-topbar-main" key={`${e.iconId}_${index}`}>
        <div className="tophalf">
          <div className="metrics-topbar-icon">
            <img src={svgName} width={35} height={35} alt={e.title} />
          </div>
          <span className="metrics-title">{e.title}</span>
        </div>
        <div className="bottomhalf">{e.value}</div>
      </div>
    );
  }

  return (
    <div className="metrics-topbar-container">
      {cardsView}
      <MachineStatusCard statusData={machineStatusData} key={"statusCardKey"} />
    </div>
  );
};

export default MetricsTopBar;
