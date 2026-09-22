import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import "../Style/Linechart.css";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
Chart.register(CategoryScale);

// Function to generate diverse range of colors
const generateColors = (count) => {
  const defaultColors = ["#127EE0", "#FF5733", "#6AFF00", "#FFC300", "#FF33F2"];
  const colors = [...defaultColors];
  for (let i = colors.length; i < count; i++) {
    const hue = (360 / (count - colors.length)) * (i - colors.length);
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const LineChart = ({
  height,
  width,
  data,
  labels,
  title,
  chartStyles = {
    backgroundColor: "#ABCEEB",
    borderWidth: 4,
    borderRadius: 7,
  },
  localizedTimeLabel,
  linesWithLabels
}) => {
  const chartRef = useRef(null);
  const numLines = data.length;
  const borderColors = generateColors(numLines);

  const datasets = data.map((lineData, index) => ({
    // label: `Line ${index + 1}`,
    label: linesWithLabels?.find((plant) => plant.lineId === index+1)?.lineName,
    data: lineData,
    borderColor: borderColors[index],
    borderWidth: chartStyles.borderWidth,
    borderRadius: chartStyles.borderRadius,
  }));

  const localizeTimestamps = (timestamps) => {
    if (!timestamps) return []; 
    const timezone = localStorage.getItem("timeZone");
    return timestamps.map((timestamp) => {
      const dateInUTC = new Date(timestamp);
      return dateInUTC.toLocaleString("en-US", {
        timeZone: timezone,
        day:"2-digit",
        month:"short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    });
  };
  const uniqueLabels = labels.filter((label, index) => labels.indexOf(label) === index);
  const chartData = {
    labels:  localizedTimeLabel?localizeTimestamps(uniqueLabels):uniqueLabels,
    datasets: datasets,
  };
console.log('dataset',linesWithLabels)
  return (
    <div className="multi-chart-container" style={{display:"block"}}>
      <div className="line-chart-legend">
        {datasets.map((dataset, index) => (
          <div key={index} className="legend-item" >
            <div className="legend-circle" style={{ backgroundColor: borderColors[index] }}></div>
            <div className="legend-label">{dataset.label}</div>
          </div>
        ))}
      </div> 
    <div style={{ height, width }} className="line-chart">  
  
      <Line
        ref={chartRef}
        data={chartData}
        options={{
          backgroundColor: "#333f44",
          elements: {
            line: {
              tension: 0.2,
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
    </div>
  );
};

export default LineChart;
