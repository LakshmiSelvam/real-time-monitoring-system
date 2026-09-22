import "../Style/BoxLayout.css";
import { useEffect, useState } from "react";
function Layout({ type, size, data, label, title }) {
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

  return (
    <div className={`mid-container ${sizes}`}>
      <div className="mid-inner-container">
        <div className="box-container">
          <div className="box-inner-container">
            <div className="box-title">{title}</div>
            {type === "BOX_1" ? (
              <div className="box1-container">
                {label.map((label, index) => (
                  <div key={index} className="cards-value-container">
                    <div
                      className={
                        size1to4
                          ? "cards-1-value-inner-containers"
                          : size2to4
                          ? "cards-2-value-inner-containers"
                          : size3to4
                          ? "cards-3-value-inner-containers"
                          : size4to4
                          ? "cards-value-inner-containers"
                          : ""
                      }
                    >
                      <div
                        className={
                          size1to4
                            ? "cards-1-value-inner-container"
                            : size2to4
                            ? "cards-2-value-inner-container"
                            : size3to4
                            ? "cards-3-value-inner-container"
                            : size4to4
                            ? "cards-value-inner-container"
                            : ""
                        }
                      >
                        <div
                          className={
                            size1to4
                              ? "cards-1to4-title"
                              : size2to4
                              ? "cards-2to4-title"
                              : size3to4
                              ? "cards-3to4-title"
                              : size4to4
                              ? "cards-4to4-title"
                              : ""
                          }
                        >
                          <p>{label}</p>
                        </div>
                        <div
                          className={
                            size1to4
                              ? "cards-11-to-4-container"
                              : size2to4
                              ? "cards-12-to-4-container"
                              : size3to4
                              ? "cards-13-to-4-container"
                              : size4to4
                              ? "cards-14-to-4-container"
                              : ""
                          }
                        >
                          <div
                            className={
                              size1to4
                                ? "cards-11-to-4"
                                : size2to4
                                ? "cards-12-to-4"
                                : size3to4
                                ? "cards-13-to-4"
                                : size4to4
                                ? "cards-14-to-4"
                                : ""
                            }
                          >
                            <p>{data[index]}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cards-value-container">
                <div
                  className={
                    size1to4
                      ? "cards-1-value-inner-containers"
                      : size2to4
                      ? "cards-2-value-inner-containers"
                      : size3to4
                      ? "cards-3-value-inner-containers"
                      : size4to4
                      ? "cards-value-inner-containers"
                      : ""
                  }
                >
                  <div
                    className={
                      size1to4
                        ? "cards-1-value-inner-container"
                        : size2to4
                        ? "cards-2-value-inner-container"
                        : size3to4
                        ? "cards-3-value-inner-container"
                        : size4to4
                        ? "cards-value-inner-container"
                        : ""
                    }
                  >
                    <div
                      className={
                        size1to4
                          ? "cards-1to4-title"
                          : size2to4
                          ? "cards-2to4-title"
                          : size3to4
                          ? "cards-3to4-title"
                          : size4to4
                          ? "cards-4to4-title"
                          : ""
                      }
                    >
                      <p>{title}</p>
                    </div>
                    <div
                      className={
                        size1to4
                          ? "cards-1-to-4-container"
                          : size2to4
                          ? "cards-2-to-4-container"
                          : size3to4
                          ? "cards-3-to-4-container"
                          : size4to4
                          ? "cards-4-to-4-container"
                          : ""
                      }
                    >
                      <div
                        className={
                          size1to4
                            ? "cards-1-to-4"
                            : size2to4
                            ? "cards-2-to-4"
                            : size3to4
                            ? "cards-3-to-4"
                            : size4to4
                            ? "cards-4-to-4"
                            : ""
                        }
                      >
                        <p>{label}</p>
                        <p>{data}</p>
                      </div>
                      <div
                        className={
                          size1to4
                            ? "cards-1-to-4"
                            : size2to4
                            ? "cards-2-to-4"
                            : size3to4
                            ? "cards-3-to-4"
                            : size4to4
                            ? "cards-4-to-4"
                            : ""
                        }
                      >
                        <p>{label}</p>
                        <p>{data}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Layout;
