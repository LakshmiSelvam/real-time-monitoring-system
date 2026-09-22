import React, { useState } from "react";
import "../Style/TimePicker.css";
import { TimePicker } from "antd";

const App = ({ placeholder }) => {
  const [value, setValue] = useState(null);

  const onChange = (time) => {
    setValue(time);
  };
  return (
    <TimePicker value={value} onChange={onChange} placeholder={placeholder} />
  );
};

export default App;
