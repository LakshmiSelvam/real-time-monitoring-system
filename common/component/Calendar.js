import React from "react";
import "../Style/Calendar.css";

function Calender(props) {
  let currentDateObj = props.currentDate ? props.currentDate : new Date();
  let currentDate = currentDateObj.getDate();
  var currentMonth = currentDateObj.getMonth();
  var currentYear = currentDateObj.getFullYear();

  var dateObj = props.active ? props.active : new Date();
  var date = dateObj.getDate();
  var month = dateObj.getMonth();
  var year = dateObj.getFullYear();
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function dataChange(changeDate, changeMonth, changeYear) {
    props.onChange(new Date(changeYear, changeMonth, changeDate));
  }

  function prevMonthChange(changeMonth, changeYear) {
    changeMonth = changeMonth - 1;
    if (changeMonth == -1) {
      changeMonth = 11;
      changeYear--;
    }
    props.monthChange(new Date(changeYear, changeMonth, date));
  }
  function nextMonthChange(changeMonth, changeYear, changeDate) {
    changeMonth = changeMonth + 1;
    if (changeMonth == 12) {
      changeMonth = 0;
      changeYear++;
    }
    props.monthChange(new Date(changeYear, changeMonth, date));
  }

  var first_day = new Date(year, month, 1);
  var last_day = new Date(year, month + 1, 0);
  var feb_days = 29;
  if ((year % 100 != 0 && year % 4 == 0) || year % 400 == 0) {
    feb_days = 29;
  } else {
    feb_days = 28;
  }
  var dayPerMonth = [31, feb_days, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var month_values = month - 1;
  if (month_values == -1) {
    month_values = 11;
  }
  var pre_month_days = dayPerMonth[month_values] - first_day.getDay() + 1;
  var week_count = 0;

  return (
    <div className="calender-content calender-popup-content flexDirectionColumn">
      <div className="calender-header flexDirectionColumn">
        <div className="calender-header-title displayFlex">
          <div className="calender-header-next-prev flexAlignCenterJustifyCenter">
            {props.previouseDate ? (
              <div
                className="calender-header-prev-icon"
                onClick={() => prevMonthChange(month, year)}
                data-testid="previous-month-btn"
              ></div>
            ) : (month > currentMonth && year >= currentYear) ||
              year > currentYear ? (
              <div
                className="calender-header-prev-icon"
                data-testid="prevMonthChange"
                onClick={() => prevMonthChange(month, year)}
              ></div>
            ) : (
              ""
            )}
          </div>
          <div
            className="calender-header-title-container flexAlignCenterJustifyCenter"
            data-testid="current-month"
          >
            <span>{months[month] + " " + year}</span>
          </div>
          <div className="calender-header-next-prev flexAlignCenterJustifyCenter">
            {props.nextDate ? (
              <div
                className="calender-header-next-icon"
                onClick={() => nextMonthChange(month, year)}
                data-testid="next-month-btn"
              ></div>
            ) : (month < currentMonth && year <= currentYear) ||
              year < currentYear ? (
              <div
                data-testid="next-month-btn"
                className="calender-header-next-icon"
                onClick={() => nextMonthChange(month, year)}
              ></div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="calender-header-week-days-container displayFlex">
          <div className="calender-header-week-day">Su</div>
          <div className="calender-header-week-day">M</div>
          <div className="calender-header-week-day">Tu</div>
          <div className="calender-header-week-day">W</div>
          <div className="calender-header-week-day">Th</div>
          <div className="calender-header-week-day">F</div>
          <div className="calender-header-week-day">Sa</div>
        </div>
      </div>
      <div className="calender-days-container flexWrap">
        {Array(dayPerMonth[month_values] - (pre_month_days - 1))
          .fill()
          .map((value, i) => {
            week_count++;
            return (
              <div
                data-testid="month-change"
                key={i}
                className={
                  props.previouseDate &&
                  year <= currentYear &&
                  month == currentMonth
                    ? "calender-day calender-prev-month-day  "
                    : props.nextDate &&
                      year <= currentYear &&
                      month == currentMonth
                    ? "calender-day calender-current-month-day calender-prev-next-month-day flexAlignCenterJustifyCenter cursor-not-allowed"
                    : "calender-day calender-current-month-day calender-prev-next-month-day flexAlignCenterJustifyCenter cursor-pointer"
                }
                onClick={
                  (props.previouseDate && year < currentYear) ||
                  (year == currentYear && month <= currentMonth)
                    ? () => dataChange(pre_month_days + i, month - 1, year)
                    : (props.nextDate && year > currentYear) ||
                      (year == currentYear && month >= currentMonth)
                    ? () => dataChange(pre_month_days + i, month - 1, year)
                    : () => dataChange(pre_month_days + i, month - 1, year)
                }
              >
                <div
                  className={
                    year <= currentYear && month == currentMonth
                      ? "flexAlignCenterJustifyCenter"
                      : ""
                  }
                >
                  {pre_month_days + i}
                </div>
              </div>
            );
          })}

        {Array(dayPerMonth[month])
          .fill()
          .map((value, i) => {
            week_count++;
            return (
              <div
                key={i}
                className={
                  props.previouseDate && props.nextDate
                    ? "calender-day cursor-pointer calender-current-month-day flexAlignCenterJustifyCenter"
                    : props.previouseDate &&
                      year == currentYear &&
                      i + 1 > currentDate &&
                      month == currentMonth
                    ? "calender-day  cursor-not-allowed flexAlignCenterJustifyCenter"
                    : props.nextDate &&
                      year == currentYear &&
                      i + 1 < currentDate &&
                      month == currentMonth
                    ? "calender-day  cursor-not-allowed flexAlignCenterJustifyCenter"
                    : "calender-day calender-current-month-day flexAlignCenterJustifyCenter cursor-pointer"
                }
                data-testid="current-month-date-selection"
                onClick={
                  props.previouseDate &&
                  ((month < currentMonth && year == currentYear) ||
                    year <= currentYear)
                    ? () => dataChange(i + 1, month, year)
                    : (props.nextDate && year > currentYear) ||
                      (year == currentYear && month >= currentMonth)
                    ? () => dataChange(i + 1, month, year)
                    : () => dataChange(i + 1, month, year)
                }
              >
                <div
                  className={
                    i + 1 == date
                      ? "active flexAlignCenterJustifyCenter flexDirectionColumn"
                      : i + 1 == currentDate &&
                        month == currentMonth &&
                        year == currentYear
                      ? "current flexAlignCenterJustifyCenter"
                      : "flexAlignCenterJustifyCenter"
                  }
                >
                  {i + 1}
                </div>
              </div>
            );
          })}
        {Array(42 - week_count)
          .fill()
          .map((value, i) => {
            return (
              <div
                key={i}
                className={
                  props.previouseDate && props.nextDate
                    ? "calender-day calender-current-month-day calender-prev-next-month-day flexAlignCenterJustifyCenter cursor-pointer"
                    : (props.previouseDate &&
                        month + 1 > currentMonth &&
                        year > currentYear) ||
                      (props.previouseDate &&
                        month + 1 > currentMonth &&
                        year == currentYear)
                    ? "calender-day calender-current-month-day calender-prev-next-month-day flexAlignCenterJustifyCenter cursor-not-allowed"
                    : "calender-day calender-current-month-day calender-prev-next-month-day flexAlignCenterJustifyCenter cursor-pointer"
                }
                data-testid="calender-current-month-day"
                onClick={() => dataChange(i + 1, month + 1, year)}
              >
                <div className="flexAlignCenterJustifyCenter">{i + 1}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Calender;
