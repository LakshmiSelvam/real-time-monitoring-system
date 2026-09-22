import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, ArcElement } from "chart.js";
import { PiechartData } from "../dummyData/LiveReportsApiData";

ChartJS.register(Title, Tooltip, ArcElement);
// test 1
function PieChart({ setParentState }) {
  const [data, setData] = useState({
    labels: ["Failed units", "Passed units"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["Red", "Green"],
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  });

  const [legendData, setLegendData] = useState({
    redBox: 0,
    greenBox: 0,
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
    setParentState(data["datasets"][0]["data"]);
  }, [data]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const tick = () => setIndex((i) => i + 1);
    fetchData();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchData();
  }, [index]);
  const fetchData = () => {
    let totalFailed = PiechartData[index % PiechartData.length]["failed"];
    let totalPassed = PiechartData[index % PiechartData.length]["passed"];

    const newData = {
      labels: ["Failed units", "Passed units"],
      datasets: [
        {
          data: [totalFailed, totalPassed],
          backgroundColor: ["Red", "Green"],
        },
      ],
    };

    setData(newData);
    setLegendData({
      redBox: totalFailed,
      greenBox: totalPassed,
    });
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        alignItems: "center",
        marginLeft: "170px",
        marginTop: "18px",
      }}
    >
      <div style={{ marginRight: "20px" }} className="pieChart-left">
        <Pie data={data} options={chartOptions} width={200} height={200} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: "15px",
              height: "10px",
              backgroundColor: "#FF0000",
              marginRight: "5px",
            }}
          />
          <span style={{ color: "#FFFFFF" }}>{`: ${legendData.redBox}`}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "15px",
              height: "10px",
              backgroundColor: "#008000",
              marginRight: "5px",
            }}
          />
          <span style={{ color: "#FFFFFF" }}>{`: ${legendData.greenBox}`}</span>
        </div>
      </div>
    </div>
  );
}
export default PieChart;
