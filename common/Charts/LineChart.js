import React, { useRef } from "react";
import { Chart } from "chart.js";
import { registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import "../Style/Linechart.css";
Chart.register(...registerables);
 
const LineChart = ({
  height,
  width,
  data,
  label,
  chartStyles = {
    backgroundColor: "#ABCEEB",
    borderColor: "#127EE0",
    borderWidth: 3,
    borderRadius: 7,
  },
  localizedTimeLabel,
  fileType
}) => {
  const chartRef = useRef(null);
 

  const localizeTimestamps = (timestamps) => {
    console.log("timestamps", timestamps);
    if (!timestamps) return [];
    const timezone = localStorage.getItem("timeZone");
    return timestamps.map((timestamp) => {
      const dateInUTC = new Date(timestamp);
 
      if (fileType == "report") {
        return dateInUTC.toLocaleString("en-US", {
          timeZone: timezone,
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } else {
        return dateInUTC.toLocaleString("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      }
    });
  };;
 
  const localizedLabels = localizedTimeLabel?localizeTimestamps(label):label;
 
  const chartData = {
    labels: localizedLabels,
    datasets: [
      {
        label: "",
        data: data,
        ...chartStyles,
      },
    ],
  };
 
  return (
    <div style={{ height, width }} className="line-chart">
      <Line
        ref={chartRef}
        data={chartData}
        options={{
          backgroundColor: "#333f44",
          elements: {
            line: {
              tension: 0.2, // You can adjust tension based on your preference
              borderWidth: 2,
            },
          },
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              grid: {
                drawBorder: true,
                color: "#FFFFFF",
              },
              ticks: {
                beginAtZero: true,
                color: "#FFFFFF",
                fontSize: 12,
              },
            },
            x: {
              grid: {
                drawBorder: true,
                color: "#FFFFFF",
              },
              ticks: {
                beginAtZero: true,
                color: "#FFFFFF",
                fontSize: 12,
              },
            },
          },
        }}
      />
    </div>
  );
};
 
export default LineChart;
