import React, { useState } from "react";
import Menu from "../../assets/images/menu-card.png";
import "../Style/MenuButton.css";

const MenuButton = () => {
  const [showRectangularShape, setShowRectangularShape] = useState(false);
  const [data, setData] = useState(null);

  const handleImageClick = () => {
    setShowRectangularShape(
      (prevShowRectangularShape) => !prevShowRectangularShape
    );

    // Mock data for testing
    const sampleData = {
      estimatedScrapRate: 10.5,
      weeklyVolumeRequired: 500,
      cycleTimePerCavity: 30,
      numberOfPlannedStops: 2,
      durationOfPlannedStop: 2,
    };

    setData(sampleData);
  };

  return (
    <div className="menu-img-container">
      <img
        className="menu-img"
        src={Menu}
        alt="not found"
        onClick={handleImageClick}
        style={{ cursor: "pointer" }}
      />
      {showRectangularShape && (
        <div className="rectangular-shape">
          {data && (
            <>
              <div className="grid-item">
                Estimated scrap rate [%]
                <div className="data-fix">{data.estimatedScrapRate}</div>
              </div>
              <div className="grid-item">
                Weekly Volume Required (units)
                <div className="data-fix">{data.weeklyVolumeRequired}</div>
              </div>
              <div className="grid-item">
                Cycle Time Per Cavity (sec)
                <div className="data-fix">{data.cycleTimePerCavity}</div>
              </div>
              <div className="grid-item">
                No. of Planned Stops Per Shift
                <div className="data-fix">{data.numberOfPlannedStops}</div>
              </div>
              <div className="grid-item">
                Duration of Planned Stop [h]
                <div className="data-fix">{data.durationOfPlannedStop}</div>
              </div>
              {/* Add more grid items as needed */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuButton;
