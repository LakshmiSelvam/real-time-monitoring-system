import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import "../Style/Charts.css";
import "../Style/MachineComp.css";
/**
 *
 * @param {object} param
 * @returns elements
 */
const ChartComponent = ({ barData, keys, machineId }) => {
  const covertDate = (inputDate) =>
    new Date(inputDate).toISOString().replace("T", " ").slice(0, 19);

  let runningArr, idleArr, StoppedArr;

  if (barData) {
    [runningArr, idleArr, StoppedArr] = [
      barData.progressData
        ?.filter((e) => e?.status === 1)[0]
        ?.timeSeries?.map((ele) => {
          return {
            x: [covertDate(ele.startTime), covertDate(ele.endTime)].map(
              (date) => date.toString()
            ), // Convert dates to strings
            y: "",
          };
        }),
      barData.progressData
        ?.filter((e) => e?.status === 2)[0]
        ?.timeSeries?.map((ele) => {
          return {
            x: [covertDate(ele.startTime), covertDate(ele.endTime)].map(
              (date) => date.toString()
            ), // Convert dates to strings
            y: "",
          };
        }),
      barData.progressData
        ?.filter((e) => e?.status === 0)[0]
        ?.timeSeries?.map((ele) => {
          return {
            x: [covertDate(ele.startTime), covertDate(ele.endTime)].map(
              (date) => date.toString()
            ), // Convert dates to strings
            y: "",
          };
        }),
    ];
  }

  const [data, setData] = useState({
    datasets: [
      {
        label: "Running",
        data: runningArr || [],
        // backgroundColor: ["rgba(173, 255, 189, 1)"],
        backgroundColor: "#6CB55A",
      },
      {
        label: "Idle",
        data: idleArr || [],
        backgroundColor: ["rgba(255, 255, 173, 1)"],
      },
      {
        label: "Stop",
        data: StoppedArr || [],
        // backgroundColor: ["rgba(255, 173, 173, 1)"],
        backgroundColor: "#F54B4B",
      },
    ],
  });

  useEffect(() => {
    const config = {
      type: "bar",
      data,
      options: {
        indexAxis: "y",
        aspectRatio: 15,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "hour",
            },
            min: "2023-09-28",
            display: false,
          },
          y: {
            beginAtZero: true,
            stacked: true,
          },
        },
        plugins: {
          tooltip: {
            displayColors: false,
            callbacks: {
              label: (ctx) => {
                const startDate = new Date(ctx.parsed._custom.barStart);
                const formattedStartDate = startDate.toLocaleString([], {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  hour12: true,
                  minute: "2-digit",
                  second: "2-digit",
                });
                return formattedStartDate;
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    };

    const ctx = document.getElementById(machineId);

    if (Chart.getChart(ctx)) {
      Chart.getChart(ctx).destroy();
    }

    const myChart = new Chart(ctx, config);

    return () => {
      myChart.destroy();
    };
  }, [data, machineId]);

  if (!barData || !machineId) return null;

  return <canvas id={machineId} key={keys} className="custom-canvas "></canvas>;
};

export default ChartComponent;
