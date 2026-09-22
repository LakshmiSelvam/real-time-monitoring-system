import { useState, useRef, useEffect } from "react";
import "../Style/SelectBox.css";

export default function SelectBox({
  label,
  options,
  value,
  onChange,
  name,
  handleChange,
  defaultText,
  disabled, // new prop to control the disabled state
}) {
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState("");
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div
      className={`dropdown ${name} ${disabled ? "disabled" : ""} ${
        options.length === 0 ? "no-options" : ""
      }`}
      ref={dropdownRef}
    >
      {label && <div className="select-box-label">{label}</div>}
      <div
        onClick={() => {
          if (!disabled) setIsActive(!isActive);
        }}
        className="dropdown-btn"
      >
        {selected ? selected : defaultText}
        <i className={isActive ? "arrow up" : "arrow down"}></i>
      </div>
      <div
        className="dropdown-content"
        style={{ display: isActive ? "block" : "none", zIndex: 2 }}
      >
        {options.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setIsSelected(item.label);
              handleChange(item.id);
              setIsActive(!isActive);
            }}
            className="item"
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
