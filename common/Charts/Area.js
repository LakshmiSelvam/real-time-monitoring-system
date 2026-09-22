// AreaChart.js
import React from "react";
import Chart from "react-apexcharts";
import "../Style/AreaChart.css";
const Area = ({ label, data, title, size }) => {
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

  // Convert UTC timestamps to local timestamps using Moment.js
  const localizeTimestamps = (timestamps) => {
    const timezone = localStorage.getItem("timeZone");
    return timestamps.map((timestamp) => {
      const dateInUTC = new Date(timestamp);
      return dateInUTC.toLocaleString("en-US", { timeZone: timezone });
    });
  };

  // Localize timestamps for label and data
  const localizedLabel = localizeTimestamps(label || []);

  const options = {
    chart: {
      id: "area-chart",
    },
    xaxis: {
      categories: localizedLabel,
      tooltip: false,
      tickAmount: 4,
      labels: {
        rotate: 0, // Set the rotation angle to 0 degrees for horizontal labels
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
  };

  const series = [
    {
      name: "Run time",
      data: data,
    },
  ];

  return (
    <div className={`area-chart-container ${getSizeClass()}`}>
      <div className="graph-layout-title">{title}</div>

      <Chart options={options} series={series} type="area" height={230} />
      {/* <Chart options={options} series={series} type="area" className="area-chart" /> */}

    </div>
  );
};

export default Area;
