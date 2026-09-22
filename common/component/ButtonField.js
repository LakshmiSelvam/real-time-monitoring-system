import React from "react";
function ButtonField(props) {
  const { onClick, label, type, dataTestid, id, className, ref, img } = props;
  //   const className = `button ${type ? type : "primary"}`;
  return (
    <React.Fragment>
      <button
        className={className}
        onClick={onClick}
        type={type ? type : "submit"}
        id={id}
        data-testid={dataTestid}
        ref={ref}
      >
        <img src={img ? img : ""} className="btn-img" />
        {label ? label : "Submit"}
      </button>
    </React.Fragment>
  );
}

export default ButtonField;
