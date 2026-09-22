import React, { useEffect, useState } from "react";
import "../Style/Table.css";
import ASort from "../../assets/svg/sort-amount-up-alt-solid.svg";
import DSort from "../../assets/svg/sort-amount-down-alt-solid.svg";
import CheckedCheckbox from "../../assets/svg/checkbox_on.svg";
import UncheckedCheckbox from "../../assets/svg/checkbox_off.svg";
import BlankEditUser from "../../assets/images/blankUserProfile.png";
import * as functions from "../functions/tableFunctions";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuView } from "react-icons/lu";
import { MdOutlineEmergency } from "react-icons/md";
import UserIcon from "../../assets/svg/manage-profile.svg";
// import { TiTick } from "react-icons/ti";
// import EditIcon from "../../assets/svg/edit.svg";
// import DeleteIcon from "../../assets/svg/delete.svg";

function Table({
  headers,
  dataTestId,
  defaultOrderBy,
  defaultSortOrder,
  data,
  editAction,
  deleteAction,
  tableTitle,
  isTitleVisible,
  disableDeleteForRow,
  paginationData,
  perPageData,
  showPageEntryContainer,
  userManage,
  viewAction,
}) {
  const [orderBy, setOrderby] = useState(defaultOrderBy);
  const [sortOrder, setsortOrder] = useState(defaultSortOrder || "asc");
  const [page, setPage] = useState(paginationData > 0 ? paginationData : 0);
  const [perPage, setPerPage] = useState(perPageData ? perPageData : 10);
  const [tableData, setTableDate] = useState([]);

  const handleSort = (column) => {
    setOrderby(column.id);
    setsortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  useEffect(() => {
    if (tableData.length != data.length) {
      setTableDate(data);
      setPage(0);
    }
  }, [data, page]);

  useEffect(() => {
    setPage(paginationData > 0 ? paginationData : 0);
  }, [perPage]);

  function handlePage(type) {
    if (type === "decrease") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  }
  let totalPage = Math.ceil(data.length / perPage);
  data.map((row, index) => {
    // console.log(row.label);
  });
  return (
    <div
      data-testid="table-container"
      id="table-container"
      className="table-container"
    >
      <div
        data-testid="table-options-container"
        id="table-options-container"
        className="table-options-container"
      >
        <div
          className="table-title-container"
          data-testid="table-title-container"
          id="table-title-container"
        >
          {tableTitle
            ? tableTitle + " - " + data.length
            : isTitleVisible == false
            ? ""
            : `Total Entries - ${data.length}`}
        </div>
        {showPageEntryContainer !== false && (
          <div className="table-page-entry-container">
            <div className="table-entry-container">
              Show
              <select
                className="table-select"
                value={perPage}
                onChange={(event) => setPerPage(event.target.value)}
                id={"show-entry-drop-down"}
                data-testid={"show-entry-drop-down"}
              >
                <option value={10} id="select-option-10">
                  10
                </option>

                {data.length > 10 ? (
                  <option
                    value={25}
                    data-testid="select-option"
                    id="select-option-25"
                  >
                    25
                  </option>
                ) : null}
                {data.length > 25 ? (
                  <option
                    value={50}
                    data-testid="select-option"
                    id="select-option-50"
                  >
                    50
                  </option>
                ) : null}
                {data.length > 50 ? (
                  <option
                    value={100}
                    data-testid="select-option"
                    id="select-option-100"
                  >
                    100
                  </option>
                ) : null}
              </select>
              Entries
            </div>
            <div className="table-paginate-container">
              <span>Page</span>
              <div className="table-paginate-inner-container">
                <span
                  className="table-paginate-next-prev table-paginate-prev"
                  data-testid="table-paginate-previous"
                  id="table-paginate-previous"
                  onClick={
                    page != 0
                      ? () => {
                          handlePage("decrease");
                        }
                      : null
                  }
                >
                  {"<"}
                </span>
                <span className="table-paginate-page">{page + 1}</span>
                <span
                  className="table-paginate-next-prev table-paginate-next"
                  data-testid="table-paginate-next"
                  id="table-paginate-next"
                  onClick={
                    page + 1 < totalPage
                      ? () => {
                          handlePage("increase");
                        }
                      : null
                  }
                >
                  {">"}
                </span>
              </div>
              <span
                data-testid="table-page-total-count"
                id="table-page-total-count"
              >
                Of {totalPage || 1}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* end of show per page */}
      <div className="table-inner-container">
        <div
          data-testid="table-header-container"
          id="table-header-container"
          className="table-header"
        >
          {headers.map((column, index) => (
            <div
              className={
                "table-header-data " +
                (column.responsive ? "show-mobile" : "hide-mobile") +
                (column.sortable ? " pointer " : "")
              }
              data-testid="table-header-data"
              key={index}
              style={{
                width: column.width || 120,
                minWidth: column.width || 120,
                justifyContent: column.justifyContent || "flex-start",
              }}
              onClick={column.sortable ? () => handleSort(column) : null}
              id={"table-header-title-" + index}
            >
              {column.label}
              {column.sortable ? (
                orderBy === column.id ? (
                  sortOrder === "asc" ? (
                    <img
                      src={ASort}
                      alt="asc"
                      data-testid="ASort-table"
                      id="ASort-table"
                      className={
                        orderBy === column.id ? " active sort-icon" : ""
                      }
                    />
                  ) : (
                    <img
                      src={DSort}
                      alt="desc"
                      data-testid="DSort-table"
                      id="DSort-table"
                      className={
                        orderBy === column.id ? " active sort-icon" : ""
                      }
                    />
                  )
                ) : (
                  <img
                    src={ASort}
                    alt="asc"
                    className="sort-icon"
                    data-testid="ASort-table"
                  />
                )
              ) : null}
            </div>
          ))}
        </div>
        <div
          data-testid="table-data-container"
          id="table-data-container"
          className="table-body"
        >
          {data.length > 0 ? (
            functions
              .stableSort(data, functions.getSorting(sortOrder, orderBy))
              .slice(page * perPage, page * perPage + perPage)
              .map((row, index) => {
                return (
                  <div
                    key={index}
                    data-testid="table-data"
                    id="table-data"
                    className="table-data-row"
                  >
                    {headers.map((column, index) =>
                      column.type && column.type === "image" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive || true
                              ? "show-mobile"
                              : "hide-mobile")
                          }
                          key={index}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                          }}
                          data-testid="image-table-data"
                          id="image-table-data"
                        >
                          {row[column.id] ? (
                            <img
                              className="image"
                              src={row[column.id]}
                              data-testid={column.dataTestid}
                              id={column.dataTestid}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = BlankEditUser;
                              }}
                              style={{ width: 30 }}
                            />
                          ) : (
                            <img
                              className="image"
                              src={BlankEditUser}
                              style={{ width: 30 }}
                              data-testid={column.dataTestid}
                              id={column.dataTestid}
                            />
                          )}
                        </div>
                      ) : column.type === "link" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          // title={row[column.id]||""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                          }}
                        >
                          <span>
                            {row[column.id] === null ||
                            row[column.id] === "" ||
                            row[column.id] === undefined ? (
                              "-"
                            ) : (
                              <Link to={column.path}>{row[column.id]}</Link>
                            )}
                          </span>
                        </div>
                      ) : column.type === "linkclick" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          // title={row[column.id]||""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                          }}
                        >
                          <span onClick={() => column.clickFunc(row, page)}>
                            {row[column.id] === null ||
                            row[column.id] === "" ||
                            row[column.id] === undefined ? (
                              "-"
                            ) : (
                              <Link
                                style={{ fontSize: column.fontSize || 12 }}
                                to={column.path}
                                data-testid={column.dataTestid}
                                id={column.dataTestid}
                              >
                                {row[column.id]}
                              </Link>
                            )}
                          </span>
                        </div>
                      ) : column.type === "multiple_data_Link" ? (
                        <div
                          className={
                            "table-data multiple-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          //title={row[column.id]||""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                            justifyContent:
                              column.justifyContent || "flex-start",
                          }}
                          title={
                            row[column.id].length > 0 &&
                            row[column.id] !== "-" &&
                            row[column.id] !== null &&
                            row[column.id] !== "" &&
                            row[column.id] !== undefined
                              ? row[column.id].map((data, index) => {
                                  return data;
                                })
                              : "-"
                          }
                        >
                          <span data-testid={column.dataTestid}>
                            {row[column.id] && row[column.id].length > 0
                              ? row[column.id].map((value, index) => {
                                  let seperator = "";
                                  {
                                    if (
                                      row[column.id].length > 1 &&
                                      row[column.id].length !== index + 1
                                    ) {
                                      seperator = ",";
                                    }
                                  }
                                  if (value) {
                                    return (
                                      <span
                                        data-testid="multiple_data"
                                        onClick={() =>
                                          column.clickFunc(row, index)
                                        }
                                      >
                                        {" "}
                                        <Link
                                          style={{
                                            fontSize: column.fontSize || 12,
                                          }}
                                          to={column.path}
                                        >
                                          {value} {seperator}
                                        </Link>
                                      </span>
                                    );
                                  }
                                })
                              : "-"}
                          </span>
                        </div>
                      ) : column.type === "checkbox" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          // title={row[column.id]||""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                            justifyContent:
                              column.justifyContent || "flex-start",
                          }}
                        >
                          <span
                            id={column.dataTestid}
                            data-testid={column.dataTestid}
                          >
                            <input
                              type="checkbox"
                              checked={row[column.id] || false}
                            />
                          </span>
                        </div>
                      ) : column.type === "checkbox_icon" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          // title={row[column.id]||""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                            justifyContent: column.justifyContent || "center",
                            paddingRight: "3%",
                          }}
                        >
                          <span
                            style={{ textAlign: "center" }}
                            data-testid={column.dataTestid}
                            id={column.dataTestid}
                          >
                            {row[column.id] ? (
                              <img
                                style={{
                                  width: "80%",
                                  minWidth: "80%",
                                }}
                                alt="checkbox"
                                src={CheckedCheckbox}
                              ></img>
                            ) : (
                              <img
                                style={{
                                  width: "80%",
                                  minWidth: "80%",
                                }}
                                alt="checkbox"
                                src={UncheckedCheckbox}
                              ></img>
                            )}
                          </span>
                        </div>
                      ) : column.type === "multiple_data" ? (
                        <div
                          className={
                            "table-data multiple-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          // title={row[column.id]||""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              column.justifyContent || "flex-start",
                          }}
                        >
                          <span data-testid={column.dataTestid}>
                            {row[column.id] && row[column.id].length > 0
                              ? row[column.id].map((value, index) => {
                                  if (value) {
                                    return (
                                      <span
                                        key={index}
                                        className="table-multiple-data"
                                      >
                                        {value}
                                      </span>
                                    );
                                  }
                                })
                              : "-"}
                          </span>
                        </div>
                      ) : column.type === "check_icon" ? (
                        <div
                          data-testid={column.dataTestId}
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                            justifyContent: column.justifyContent || "center",
                          }}
                        >
                          <span
                            data-testid={column.dataTestid}
                            id={column.dataTestid}
                          >
                            {/* {row[column.id] ? <TiTick size="25px" /> : "-"} */}
                            {row[column.id] ? "-" : "-"}
                          </span>
                        </div>
                      ) : column.type === "alarmButton" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          // title={row.buttonName||""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                            justifyContent:
                              column.justifyContent || "flex-start",
                          }}
                        >
                          <button
                            className="table-btn-field"
                            style={{
                              // background: row.buttonColor || "red",
                              background:
                                row.isDeactivated == "Active" ? "green" : "red",
                            }}
                          >
                            {/* {row.image ? (
                              <img src="" alt="alert-icon" />
                            ) : (
                              <img
                                src={row.icon}
                                alt="alert-icon"
                                className="icon-style"
                              />
                            )} */}
                            {/* {row.buttonName} */}
                            {row.isDeactivated}
                          </button>
                        </div>
                      ) : column.type === "action" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          // title={row[column.id] || ""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                          }}
                          data-testid="manage-action-container"
                          id="manage-action-container"
                        >
                          {editAction ? (
                            <FaRegEdit
                              data-testid="edit-action-icon"
                              id="edit-action-icon"
                              style={{
                                color: "white",
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                editAction(row, page, perPage);
                              }}
                            />
                          ) : (
                            ""
                          )}
                          {deleteAction &&
                          (disableDeleteForRow
                            ? !row.loggedInUser
                            : true && !userManage == true) ? (
                            <RiDeleteBinLine
                              data-testid="delete-action-icon"
                              id="delete-action-icon"
                              style={{
                                color: "white",
                                marginLeft: "13px",
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                deleteAction(row);
                              }}
                            />
                          ) : (
                            <img
                              src={UserIcon}
                              id="delete-action-icon"
                              style={{
                                color: "white",
                                marginLeft: "13px",
                                width: "25px",
                                height: "25px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                deleteAction(row);
                              }}
                            />
                          )}
                          {viewAction ? (
                            <LuView
                              data-testid="view-action-icon"
                              id="view-action-icon"
                              style={{
                                color: "white",
                                width: "25px",
                                height: "25px",
                                marginLeft: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                viewAction(row, page, perPage);
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      ) : column.type === "multipleText" ? (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                          }}
                          title={
                            row[column.id].length > 0 &&
                            row[column.id] !== "-" &&
                            row[column.id] !== null &&
                            row[column.id] !== "" &&
                            row[column.id] !== undefined
                              ? row[column.id].map((data, index) => {
                                  return data;
                                })
                              : "-"
                          }
                        >
                          <span
                            data-testid={column.dataTestId || column.dataTestid}
                            id={
                              column.dataTestId || column.dataTestid
                            } /*title="col-value"*/
                          >
                            {row[column.id] === null ||
                            row[column.id] === "" ||
                            row[column.id] === undefined
                              ? "-"
                              : row[column.id].length == index + 1
                              ? row[column.id]
                              : row[column.id] + ", "}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={
                            "table-data " +
                            (column.responsive ? "show-mobile" : "hide-mobile")
                          }
                          key={index}
                          title={row[column.id] || ""}
                          style={{
                            width: column.width || 120,
                            minWidth: column.width || 120,
                          }}
                        >
                          <span
                            data-testid={column.dataTestId || column.dataTestid}
                            id={
                              column.dataTestId || column.dataTestid
                            } /*title="col-value"*/
                          >
                            {row[column.id] === null ||
                            row[column.id] === "" ||
                            row[column.id] === undefined
                              ? "-"
                              : row[column.id]}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                );
              })
          ) : (
            <div
              className="no-data"
              data-testid="no-data-testid"
              id="no-data-testid"
            >
              {" "}
              No data Available{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;
