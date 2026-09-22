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
  disabled,
  initialSelected,
}) {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState(initialSelected || []);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsActive(false);
    }
  };
  
  useEffect(() => {
    setSelected(initialSelected || []);
  }, [initialSelected])

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const toggleSelection = (item) => {
    const updatedSelection = selected.includes(item.id)
      ? selected.filter(id => id !== item.id)
      : [...selected, item.id];

    setSelected(updatedSelection);
    handleChange(updatedSelection);
  };

  const getSelectedLabels = () => {
    if (selected.length === 0) return defaultText;
    return options
      .filter(option => selected.includes(option.id))
      .map(option => option.label)
      .join(", ");
  };

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
        {getSelectedLabels()}
        <i className={isActive ? "arrow up" : "arrow down"}></i>
      </div>
      <div
        className="dropdown-content"
        style={{ display: isActive ? "block" : "none", zIndex: 2 }}
      >
        {options.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleSelection(item)}
            className={`item ${selected.includes(item.id) ? "selected" : "unselected"}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
