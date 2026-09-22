// BarChart.js
import React, { useRef } from "react";
import { Chart } from "chart.js";
import { registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import "../Style/Barchart.css";
Chart.register(...registerables);
 
const BarChart = ({
  height,
  width,
  label,
  data,
  barWidth,
  chartStyles = {
    backgroundColor: "#68B2A9",
    borderColor: "#68B2A9",
    borderWidth: 1,
    borderRadius: 7,
  },
}) => {
  const chartRef = useRef(null);
 
  // const localizeTimestamps = (timestamps) => {
  //   if (!timestamps) return []; // Added check for undefined or null timestamps
  //   const timezone = localStorage.getItem("timeZone");
  //   return timestamps.map((timestamp) => {
  //     const dateInUTC = new Date(timestamp);
  //     return dateInUTC.toLocaleString("en-US", { timeZone: timezone });
  //   });
  // };
  // const localizedLabels = localizeTimestamps(label);
 
  const chartData = {
    labels: label,
    datasets: [
      {
        label: "",
        data: data,
        barThickness: barWidth,
        ...chartStyles,
      },
    ],
  };
  return (
    <div style={{ width, height }} className="bar-chart">
      <Bar
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
 
export default BarChart;
 