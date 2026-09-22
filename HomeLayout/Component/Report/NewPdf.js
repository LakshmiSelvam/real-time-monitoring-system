import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import "../../Style/Pdf.css";
import GraphLayout from "../../../common/component/GraphLayout";
import Table from "../../../common/component/Table";

const NewPdf = forwardRef((props, ref) => {
  let PlantName = props.PlantName;
  let LineName = props.LineName;
  let MachineName = props.MachineName;
  let PlantLevel = props.PlantLevel;
  let LineLevel = props.LineLevel;
  let FromDate = props.FromDate;
  let ToDate = props.ToDate;
  let oEETitle = props.oEETitle;
  let oEELable = props.oEELable;
  let oEEData = props.oEEData;
  let downTimeTitle = props.downTimeTitle;
  let downTimeLable = props.downTimeLable;
  let downTimeData = props.downTimeData;
  let qualityTitle = props.qualityTitle;
  let qualityLable = props.qualityLable;
  let qualityData = props.qualityData;
  let powerTitle = props.powerTitle;
  let powerLable = props.powerLable;
  let powerData = props.powerData;

  const pdfRef = useRef();
  let pdfWindow = null;
  useImperativeHandle(ref, () => ({
    handlePDF() {
      const input = pdfRef.current;
      const pdf = new jsPDF("p", "mm", "a4", true);
      let yOffset = 10;
      const addPageContent = (canvas) => {
        const imgData = canvas.toDataURL("imgae/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          yOffset,
          imgWidth * ratio,
          imgHeight * ratio
        );

        yOffset += imgHeight * ratio + 10; // Increase Y offset for the next content
      };

      html2canvas(input.querySelector(".headers")).then((canvas) => {
        addPageContent(canvas);
        html2canvas(input.querySelector(".graph-lists-container")).then(
          (canvas) => {
            addPageContent(canvas);
            html2canvas(input.querySelector(".graph-lists-container2")).then(
              (canvas) => {
                addPageContent(canvas);

                html2canvas(input.querySelector(".reports-table")).then(
                  (canvas) => {
                    addPageContent(canvas);

                    pdf.output("dataurlnewwindow");
                    // pdf.save('report.pdf'); // Save the generated PDF
                  }
                );
              }
            );
          }
        );
      });
    },
  }));

  const findMinValue = (item) => {
    if (!item.value || item.value.length === 0) return "";
    const values = item.value.map((entry) => {
      let value;
      switch (item.title) {
        case "OEE":
          value = parseFloat(entry.oee || entry.value);
          //   console.log("entry.oee || entry.value", value);
          break;
        case "Downtime":
          value = parseFloat(entry.downtime || entry.value);
          break;
        case "Quality":
          value = parseFloat(entry.quality || entry.value);
          break;
        case "Power Consumptions":
          value = parseFloat(entry.powerConsumptions || entry.value);
          break;
        default:
          value = 0;
      }
      return isNaN(value) ? 0 : value;
    });
    return Math.min(...values).toFixed(2);
  };
  const findMaxValue = (item) => {
    if (!item.value || item.value.length === 0) return ""; // No values
    const values = item.value.map((entry) => {
      let value;
      switch (item.title) {
        case "OEE":
          value = parseFloat(entry.oee || entry.value);
          break;
        case "Downtime":
          value = parseFloat(entry.downtime || entry.value);
          break;
        case "Quality":
          value = parseFloat(entry.quality || entry.value);
          break;
        case "Power Consumptions":
          value = parseFloat(entry.powerConsumptions || entry.value);
          break;
        // Add cases for other titles as needed
        default:
          value = 0;
      }
      return isNaN(value) ? 0 : value;
    });
    return Math.max(...values).toFixed(2);
  };
  return (
    <div className="container" ref={pdfRef}>
      <div className="pdf-container">
        <div className="headers">
          <h1>Report</h1>
          <h2>Generated on Date</h2>
          <div className="selected-label">
            <div className="selected-data-1">
              <div className="key-value-pair">
                <div className="key">PlantName</div>
                <div className="value">{PlantName}</div>
              </div>
              <div className="key-value-pair">
                <div className="key">LineName</div>
                <div className="value">{LineName}</div>
              </div>
              <div className="key-value-pair">
                <div className="key">MachineName</div>
                <div className="value">{MachineName}</div>
              </div>
              <div className="key-value-pair">
                <div className="key">PlantLevel</div>
                <div className="value">{PlantLevel}</div>
              </div>
            </div>
            <div className="selected-data-1">
              <div className="key-value-pair">
                <div className="key">LineLevel</div>
                <div className="value">{LineLevel}</div>
              </div>
              <div className="key-value-pair">
                <div className="key">FromDate</div>
                <div className="value">
                  {FromDate != "Invalid date" ? FromDate : ""}
                </div>
              </div>
              <div className="key-value-pair">
                <div className="key">ToDate</div>
                <div className="value">
                  {ToDate != "Invalid date" ? ToDate : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* first row graph */}
        <div className="graph-lists-container">
          <div className="graph-list-one">
            <h3>Overall Equipment Effectiveness </h3>
            <div className="charts-container">
              <div className="history-status-mid-container">
                <GraphLayout
                  type="LINE_CHART"
                  size="4/4"
                  title={oEETitle}
                  label={oEELable}
                  data={oEEData}
                  localizedTimeLabel={false}
                  xAxisColor="black"
                  yAxisColor="black"
                  borderColor="#23511E"
                />
              </div>
            </div>
          </div>
          <div className="graph-list-two">
            <h3>Downtime </h3>
            <div className="charts-container">
              <div className="history-status-mid-container">
                <GraphLayout
                  type="LINE_CHART"
                  size="4/4"
                  title={downTimeTitle}
                  label={downTimeLable}
                  data={downTimeData}
                  localizedTimeLabel={false}
                  xAxisColor="black"
                  yAxisColor="black"
                  borderColor="#2A265F"
                />
              </div>
            </div>
          </div>
        </div>
        {/* second row graph */}
        <div className="graph-lists-container2">
          <div className="graph-list-one">
            <h3>Quality </h3>
            <div className="charts-container">
              <div className="history-status-mid-container">
                <GraphLayout
                  type="LINE_CHART"
                  size="4/4"
                  title={qualityTitle}
                  label={qualityLable}
                  data={qualityData}
                  localizedTimeLabel={false}
                  xAxisColor="black"
                  yAxisColor="black"
                  borderColor="#8F4700"
                />
              </div>
            </div>
          </div>
          <div className="graph-list-two">
            <h3>Power Consumptions</h3>
            <div className="charts-container">
              <div className="history-status-mid-container">
                <GraphLayout
                  type="LINE_CHART"
                  size="4/4"
                  title={powerTitle}
                  label={powerLable}
                  data={powerData}
                  localizedTimeLabel={false}
                  xAxisColor="black"
                  yAxisColor="black"
                  borderColor="#002F5D"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="reports-table">
          {props.apiData ? (
            <Table
              headers={[
                {
                  id: "title",
                  label: "Title",
                  width: 100,
                  responsive: true,
                  sortable: false,
                  dataTestid: "title",
                },
                {
                  id: "minValue",
                  label: "Minimum Value",
                  width: 50,
                  responsive: true,
                  sortable: false,
                  dataTestid: "minValue",
                },
                {
                  id: "maxValue",
                  label: "Maximum Value",
                  width: 50,
                  responsive: true,
                  sortable: false,
                  dataTestid: "maxValue",
                },
              ]}
              data={props.apiData.map((item) => ({
                title: item?.title,
                minValue: findMinValue(item),
                maxValue: findMaxValue(item),
                // minDate: findOverallStartDate(item),
                // maxDate: findOverallEndDate(item),
                // startDate: findStartDate(item),
                // endDate: findEndDate(item),
              }))}
              //   tableTitle={"Total Users"}
              showPageEntryContainer={false}
              // data={[]}
              defaultOrderBy={"accountName"}
              defaultSortOrder={"asc"}
              userManage={true}
              editAction={() => {}}
              deleteAction={() => {}}
            />
          ) : (
            ""
          )}
        </div>
        {/* <button onClick={handlePDF} className="pdf-btn">DOWNLOAD</button> */}
      </div>
    </div>
  );
});
export default NewPdf;
