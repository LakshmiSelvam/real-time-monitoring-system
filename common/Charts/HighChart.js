import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../Style/HighChart.css";
require("highcharts/highcharts-more")(Highcharts);

const HighArea = ({ label, data, title, size, min, max }) => {
  const initialTimeRange = 5 * 60 * 1000; // 5 minutes in milliseconds
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [isResetVisible, setIsResetVisible] = useState(false);

  useEffect(() => {
    // Update the time range when the component mounts
    setTimeRange(initialTimeRange);
    setIsResetVisible(false);
  }, [label, data]);

  const getSizeClass = () => {
    switch (size) {
      case "1/4":
        return "size1to4";
      case "2/4":
        return "size2to4";
      case "3/4":
        return "size3to4";
      case "4/4":
        return "size4to4";
      default:
        return "";
    }
  };

  const handlePreviousClick = () => {
    setTimeRange((prevRange) => prevRange + 5 * 60 * 1000); // Add 5 minutes
    setIsResetVisible(true);
  };

  const handleResetClick = () => {
    setTimeRange(initialTimeRange);
    setIsResetVisible(false);
  };

  const localizeTimestamps = (timestamps) => {
    if (!timestamps) return [];
    const timezone = localStorage.getItem("timeZone");
    return timestamps.map((timestamp) => {
      const dateInUTC = new Date(timestamp);
      return dateInUTC.toLocaleString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });
  };

  const localizedLabel = localizeTimestamps(label || []);
  const numericData = data.map((value) => parseFloat(value));

  // Calculate the filtered range based on the current timeRange
  const endTime = new Date(label[label.length - 1]).getTime();
  const startTime = endTime - timeRange;

  const filteredLabels = [];
  const filteredData = [];

  for (let i = label.length - 1; i >= 0; i--) {
    const time = new Date(label[i]).getTime();
    if (time >= startTime && time <= endTime) {
      filteredLabels.unshift(localizedLabel[i]);
      filteredData.unshift(numericData[i]);
    }
  }

  const options = {
    chart: {
      type: "line",
      backgroundColor: "#333f44",
      height: 260,
      marginRight: 30,
      zooming: {
        type: "x",
      },
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: filteredLabels,
      labels: {
        style: {
          color: "#FFFFFF",
        },
      },
    },
    yAxis: {
      labels: {
        style: {
          color: "#FFFFFF",
        },
      },
      title: {
        text: null,
      },
    },
    series: [
      {
        name: "Temperatures",
        data: filteredData,
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, "#46D4C3"],
            [1, "rgba(166, 129, 224, 0.9)"],
          ],
        },
      },
    ],
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      valueSuffix: " °C",
    },
  };
  // console.log("data", data);
  // console.log("filtered", filteredData);
  return (
    <div className={`${getSizeClass()}`} style={{ position: "relative" }}>
      <div className="layout-title">
        <button onClick={handlePreviousClick} className="prevButton">
          &lt; 5mins
        </button>
        {isResetVisible && (
          <button onClick={handleResetClick} className="resetButton">
            Reset
          </button>
        )}
        {title}
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default HighArea;