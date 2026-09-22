import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "../Style/AreaChart.css";
const ApexChart = ({ data }) => {
  console.log("data", data);
  const minTimestamp = Math.min(...data.map(([timestamp, _]) => timestamp));
  console.log("min", new Date());
  const [state, setState] = useState({
    series: [
      {
        data: data,
        data: [
          [1327359600000, 30.95],
          [1327446000000, 31.34],
          [1327532400000, 31.18],
          [1327618800000, 31.05],
          [1327878000000, 31.0],
          [1327964400000, 30.95],
          [1328050800000, 31.24],
          [1328137200000, 31.29],
          [1328223600000, 31.85],
          [1328482800000, 31.86],
          [1328569200000, 32.28],
          [1328655600000, 32.1],
          [1328742000000, 32.65],
          [1341957600000, 30.2],
          [1342044000000, 30.14],
          [1342130400000, 30.65],
          [1342389600000, 30.4],
          [1342476000000, 30.65],
          [1342562400000, 31.43],
          [1342648800000, 31.89],
          [1342735200000, 31.38],
          [1342994400000, 30.64],
          [1343080800000, 30.02],
          [1343167200000, 30.33],
          [1343253600000, 30.95],
          [1343340000000, 31.89],
          [1343599200000, 31.01],
          [1343685600000, 30.88],
          [1343772000000, 30.69],
          [1346882400000, 32.79],
          [1346968800000, 32.46],
          [1347228000000, 32.13],
          [1347314400000, 32.43],
          [1347400800000, 32.42],
          [1347487200000, 32.81],
          [1347573600000, 33.34],
          [1347832800000, 33.41],
          [1347919200000, 32.57],
          [1348005600000, 33.12],
          [1348092000000, 34.53],
          [1348178400000, 33.83],
          [1348437600000, 33.41],
          [1348524000000, 32.9],
          [1348610400000, 32.53],
          [1348696800000, 32.8],
          [1348783200000, 32.44],
          [1349042400000, 32.62],
          [1353279600000, 32.92],
          [1353366000000, 32.64],
          [1353452400000, 32.84],
          [1353625200000, 33.4],
          [1353884400000, 33.3],
          [1353970800000, 33.18],
          [1354057200000, 33.88],
        ],
      },
    ],
    options: {
      chart: {
        id: "area-datetime",
        type: "area",
        height: 350,
        zoom: {
          autoScaleYaxis: true,
        },
      },
      annotations: {
        // annotations data
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
      xaxis: {
        type: "datetime",
        min: new Date("01 Mar 2012").getTime(),
        min: new Date("20 FEB 2024").getTime(),
        tickAmount: 6,
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    },
    selection: "one_year",
  });

  const updateData = (timeline) => {
    setState((prevState) => ({
      ...prevState,
      selection: timeline,
    }));

    // switch statement remains the same
  };
  console.log("seriese", state.series);
  return (
    <div className="area-chart-container">
      <div id="chart">
        <div className="toolbar">
          <button
            id="one_month"
            onClick={() => updateData("one_month")}
            className={state.selection === "one_month" ? "active" : ""}
          >
            1M
          </button>
          {/* remaining buttons */}
        </div>

        <div id="chart-timeline">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
