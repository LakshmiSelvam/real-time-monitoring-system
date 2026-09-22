import React, { useEffect, useState } from "react";
import "../Style/Charts.css";
// test 1
function ProcessBar({ apiResponse }) {
  const [apiValue, setApiValue] = useState(50);

  // useEffect(() => {
  //   if (apiResponse !== undefined) {
  //     setApiValue(apiResponse);
  //   } else {
  //     setTimeout(() => {
  //       const simulatedApiResponse = 60;
  //       setApiValue(simulatedApiResponse);
  //     }, 1000);
  //   }
  // }, [apiResponse]);

  const newDataWidth = apiValue + "%";
  const dataStyle = {
    backgroundColor: apiValue > 10 ? "#6CB55A" : "red",
    width: newDataWidth,
    transition: "width 0.5s",
  };

  return (
    <div className="master">
      <div className="data" style={dataStyle}></div>
      <div className="remaining"></div>
    </div>
  );
}

export default ProcessBar;
