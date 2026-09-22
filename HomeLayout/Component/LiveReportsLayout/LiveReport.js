import MetricsTopBar from "../../../common/component/MetricsTopBar";
import React, { useEffect, useState } from "react";
import "../../Style/LiveReports.css";
import apiData, {
  getOnlyMetricsTopBar,
  getThroghtData,
  getQualityData,
} from "../../../common/dummyData/LiveReportsApiData.js";
import jsonData, {
  getOeeLast24Hrs,
} from "../../../common/dummyData/SampleApiData.js";
import LineChart from "../../../common/Charts/LineChart.js";
import BarChart from "../../../common/Charts/BarChart.js";
//import PieChart from "../../../common/Charts/PieChart.js";
import PassedUnits from "../../../assets/svg/PassedUnits.svg";
import FailedUnits from "../../../assets/svg/FailedUnits.svg";
//import MenuButton from "../../../common/component/MenuButton.js";
import Remaining from "../../../assets/svg/remaining.svg";
import ProductionImg from "../../../assets/svg/productionImg.svg";
import Pie from "../../../common/Charts/Pie.js";
import Vector from "../../../assets/svg/Vector.svg";
import SettingImg from "../../../assets/svg/settings-logo-new.svg";
function LiveReport() {
  const charts = apiData?.main;
  const chart = jsonData?.data?.homeData[0]?.graphs?.graphs;
  // section for labels
  const BarChartlabel = charts?.find((e) => e.type === "barChart#2/4")?.label;
  const LineChartlabel = chart?.find((e) => e.type === "lineChart#1/3")?.label;
  const PieChartlabel = charts?.find((e) => e.type === "pieChart#1/3")?.label;
  const [parentState, setParentState] = useState("");

  // section of data updation based on type
  const [BarChartdata, setBarChartdata] = useState(
    charts?.find((e) => e.type === "barChart#2/4")?.data
  );

  const [LineChartdata, setLineChartdata] = useState(
    chart?.find((e) => e.type === "lineChart#1/3")?.data
  );

  const [PieChartdata, setPieChartdata] = useState(
    charts?.find((e) => e.type === "pieChart#1/3")?.data
  );

  const BarChartStyles = {
    backgroundColor: "#68B2A9",
    borderColor: "#68B2A9",
    borderWidth: 1,
    borderRadius: 7,
    barThickness: 52,
  };

  const LineChartStyles = {
    backgroundColor: "#FFFFFF",
    borderColor: "#1E90FF",
    borderWidth: 4,
    // fillColor: "rgba(70, 212, 195, 0.56)",
  };

  useEffect(() => {
    const Interval = setInterval(() => {
      setBarChartdata(getThroghtData());
      setLineChartdata(getOeeLast24Hrs);
    }, 1000);

    const updatePieChartData = () => {
      setPieChartdata(getQualityData());
    };
    const PieChartInterval = setInterval(updatePieChartData, 2000);
    return () => [clearInterval(Interval, PieChartInterval)];
  }, []);

  // scrab rate card data updation function

  const totalFailed = parentState[0]; // Assuming the first element is the number of failed units
  const totalPassed = parentState[1];
  const total = totalFailed + totalPassed;
  const scrapRate = (totalFailed / 1000) * 100;

  const newState = [...getOnlyMetricsTopBar];
  newState[3].value = `${scrapRate.toFixed()}%`;

  const MetricsTopBarView = <MetricsTopBar data={newState} />;

  const [data, setData] = useState({
    good: 600,
    bad: 50,
  });

  // Create data for the pie chart
  const chartData = {
    labels: ["Good", "Bad"],
    datasets: [
      {
        data: [data.good, data.bad],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };
  const status = localStorage.getItem("status");
  return (
    <React.Fragment>
      <div className="live-report-container">
        <div className="main-layout">{MetricsTopBarView}</div>
        <div className="graphs_split">
          <div className="grid-layout">
            <div className="chart-container">
              <div className="left-split-heading">
                <img className="svg-img" src={ProductionImg} alt="" />
                <span className="left-split-text">
                  Throughput (Rate of production)
                </span>
              </div>
              <BarChart
                // height="290px"
                backgroundColor={"#ABCEEB"}
                chartStyles={BarChartStyles}
                data={BarChartdata}
                label={BarChartlabel}
              />
            </div>
            <div className="pieChart-container">
              <div className="pie_chart_heading">
                <img className="svg-img" src={Vector} alt="" />
                <span className="pie-chart-title-text">
                  First pass yield rate in Units
                </span>
              </div>
              <div className="pieChart-innerLayouts">
                <div className="pieChart-inner-split">
                  <img className="svg-img" src={PassedUnits} alt="" />
                  <span className="pie-chart-headings">Passed</span>
                </div>
                <div className="pieChart-inner-split">
                  <img className="svg-img" src={FailedUnits} alt="" />
                  <span className="pie-chart-headings">Failed</span>
                </div>
                <div className="pieChart-inner-split">
                  <img className="svg-img" src={Remaining} alt="" />
                  <span className="pie-chart-headings">Remaining</span>
                </div>
              </div>
              <div className="chart-margin-left">
                <Pie
                  height={"210px"}
                  data={PieChartdata}
                  label={PieChartlabel}
                  setParentState={setParentState}
                />
              </div>
            </div>
            <div className="grid-layout-2">
              <div className="OEE-heading-split">
                <div className="left-split-heading">
                  <img className="svg-img" src={SettingImg} alt="" />
                  <span className="left-split-text">
                    OEE- Last 24Hrs Performance Analysis
                  </span>
                </div>
              </div>
              <LineChart
                // height="290px"
                pointBorderColor="blue"
                chartStyles={LineChartStyles}
                data={LineChartdata}
                label={LineChartlabel}
                isGradient={true}
              />
            </div>
            {/* <MenuButton /> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LiveReport;
