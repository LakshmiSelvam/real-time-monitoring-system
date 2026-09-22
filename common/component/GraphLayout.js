import { useState, useEffect } from "react";
import LineChart from "../../common/Charts/LineChart";
import BarChart from "../Charts/BarChart";
import "../Style/GraphLayout.css";
import Area from "../Charts/Area"
import  MultilineChart  from  '../../common/Charts/MultiLineChart'
function GraphLayout({ type, size, label, data, title,localizedTimeLabel,fileType}) {
  const [size1to4, setSize1to4] = useState(false);
  const [size2to4, setSize2to4] = useState(false);
  const [size3to4, setSize3to4] = useState(false);
  const [size4to4, setSize4to4] = useState(false);
  const [sizes, setSize] = useState("");

  useEffect(() => {
    if (size == "1/4") {
      setSize("size1to4 ");
      setSize1to4(true);
      setSize2to4(false);
      setSize3to4(false);
      setSize4to4(false);
    } else if (size == "2/4") {
      setSize("size2to4 ");
      setSize1to4(false);
      setSize2to4(true);
      setSize3to4(false);
      setSize4to4(false);
    } else if (size == "3/4") {
      setSize("size3to4 ");
      setSize1to4(false);
      setSize2to4(false);
      setSize3to4(true);
      setSize4to4(false);
    } else if (size == "4/4") {
      setSize("size4to4 ");
      setSize1to4(false);
      setSize2to4(false);
      setSize3to4(false);
      setSize4to4(true);
    }
  }, [size]);
  const localizeTimestamps = (timestamps) => {
    const timezone = localStorage.getItem("timeZone");
    return timestamps.map((timestamp) => {
      const dateInUTC = new Date(timestamp);
      return dateInUTC.toLocaleString("en-US", { timeZone: timezone });
    });
  };

  // Localize timestamps for label and data
  const localizedLabel = localizeTimestamps(label || []);

  return (
    <div className={`graph-layout-container ${sizes}`}>
      <div className="graph-layout-inner-contaier">
        <div
          className={
            size1to4
              ? "graph-1-4-container"
              : size2to4
              ? "graph-2-4-container"
              : size3to4
              ? "graph-3-4-container"
              : size4to4
              ? "graph-4-4-container"
              : ""
          }
        >
          <div className="graph-layout-title">{title}</div>
          {type == "LINE_CHART" ? (
            <LineChart
             fileType={fileType}
              borderRadius={"15px"}
              localizedTimeLabel={localizedTimeLabel}
              label={label}
              data={data}
            />
         
          ) :type == 'BAR_CHART'? (
            <BarChart borderRadius={"15px"} label={label} data={data} />
          ):<Area  borderRadius={"15px"} label={label} data={data}/>}
        </div>
      </div>
    </div>
  );
}
export default GraphLayout;
