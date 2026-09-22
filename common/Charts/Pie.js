import "../Style/Piechart.css";
import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, ArcElement } from "chart.js";
import { PiechartData } from "../dummyData/LiveReportsApiData";
ChartJS.register(Title, Tooltip, ArcElement);

function PieChart({ setParentState }) {
  const totalProduction = 1000; // Total production count
  const [data, setData] = useState({
    labels: ["Failed units", "Passed units", "Remaining"],
    datasets: [
      {
        data: [0, 0, totalProduction],
        backgroundColor: ["Red", "Green", "Blue"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  });

  const [legendData, setLegendData] = useState({
    redBox: 0,
    greenBox: 0,
    blueBox: totalProduction,
  });

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: false,
      tooltip: true,
      beforeDraw: (chart) => {},
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  useEffect(() => {
    setParentState(data.datasets[0].data);
  }, [data, setParentState]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (status == "Running") {
      const tick = () => setIndex((i) => i + 1);
      fetchData();
      const id = setInterval(tick, 2000);
      return () => clearInterval(id);
    } else {
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [index]);

  const fetchData = () => {
    let totalFailed = PiechartData[index % PiechartData.length]["failed"];
    let totalPassed = PiechartData[index % PiechartData.length]["passed"];
    let remaining = totalProduction - totalFailed - totalPassed;

    const newData = {
      labels: ["Failed units", "Passed units", "Remaining"],
      datasets: [
        {
          data: [totalFailed, totalPassed, remaining],
          backgroundColor: ["Red", "Green", "Blue"],
        },
      ],
    };

    setData(newData);
    setLegendData({
      redBox: totalFailed,
      greenBox: totalPassed,
      blueBox: remaining,
    });
  };
  const status = localStorage.getItem("status");
  useEffect(() => {
    const goodInterval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [
              prevData.datasets[0].data[0],
              prevData.datasets[0].data[1] + 1,
              prevData.datasets[0].data[2] - 1,
            ],
          },
        ],
      }));
    }, 600000);

    const badInterval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [
              prevData.datasets[0].data[0] + 1,
              prevData.datasets[0].data[1],
              prevData.datasets[0].data[2] - 1,
            ],
          },
        ],
      }));
    }, 800000);

    return () => {
      clearInterval(goodInterval);
      clearInterval(badInterval);
    };
  }, []);

  const stop = {
    labels: ["Failed units", "Passed units", "Remaining"],
    datasets: [
      {
        data: [19, 910, 71],
        backgroundColor: ["Red", "Green", "Blue"],
      },
    ],
  };

  // style={{
  //   display: "flex",
  //   alignItems: "center",
  //   marginLeft: "170px",
  //   marginTop: "18px",
  // }}
  return (
    <div className="piechart-style ">
      {/* <div style={{ marginRight: "20px" }}> */}
      <div className="pie-chart">
        <Pie data={data} options={chartOptions} width={200} height={200} />
      </div>
      <div className="chart-content-container">
        <div className="failed-unit-container">
          <div className="failed-unit" />
          <span
            style={{ color: "#FFFFFF" }}
            className="units"
          >{`: ${legendData.redBox}`}</span>
        </div>
        <div className="passed-unit-container">
          <div className="passed-unit" />
          <span
            style={{ color: "#FFFFFF" }}
            className="units"
          >{`: ${legendData.greenBox}`}</span>
        </div>
        <div className="remaining-unit-container">
          <div className="remaining-unit" />
          <span
            style={{ color: "#FFFFFF" }}
            className="units"
          >{`: ${legendData.blueBox}`}</span>
        </div>
      </div>
    </div>
  );
}

export default PieChart;
