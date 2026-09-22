import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "../Style/HighChart.css";
require("highcharts/highcharts-more")(Highcharts);

const NewLineChart = ({ label, data, title, size }) => {
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

  const localizeTimestamps = (timestamps) => {
    if (!timestamps) return [];
    const timezone = localStorage.getItem("timeZone");
    return timestamps.map((timestamp) => {
      const dateInUTC = new Date(timestamp);
      return dateInUTC.toLocaleString("en-US", {
        timeZone: timezone,
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });
  };

  const localizedLabel = localizeTimestamps(label || []);
  const numericData = data.map((value) => parseFloat(value));

  const options = {
    chart: {
      type: "line",
      backgroundColor: "#333f44",
      height: 340,
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
      categories: localizedLabel,
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
        name: "Value",
        data: numericData,
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
  };

  return (
    // <div className={`${getSizeClass()}`} style={{ position: "relative" }}>
    <div className="heightChart" style={{ position: "relative" }}>
      {/* <div className="layout-title">{title}</div> */}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default NewLineChart;
