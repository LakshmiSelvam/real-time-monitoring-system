import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, forwardRef, useImperativeHandle } from "react";
import Table from "./Table";
import moment from "moment";
import Logo from "../../assets/images/pdf-logo.png";
import { useSelector } from "react-redux";
import NewLineChart from "../Charts/NewLineChart";
import "../Style/OnClickPdf.css";
const Pdf = forwardRef((props, ref) => {
  const loggedUser = useSelector((state) => state.userReducer.loggedUser);
  const {
    TagName,
    PlantName,
    PlantAddress,
    FromDate,
    ToDate,
    chartData,
    minValue,
    maxValue,
    minTimestamp,
    maxTimestamp,
  } = props;

  const pdfRef = useRef();

  useImperativeHandle(ref, () => ({
    handlePDF() {
      const input = pdfRef.current;
      const pdf = new jsPDF("p", "mm", "a4", true);
      pdf.setLineWidth(0.5); // Adjust the width as needed
      pdf.setDrawColor(0); // Set the draw color to black

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

        yOffset += imgHeight * ratio + 10;
      };

      html2canvas(input.querySelector(".headers")).then((canvas) => {
        addPageContent(canvas);
        html2canvas(input.querySelector(".table-report")).then((canvas) => {
          addPageContent(canvas);

          html2canvas(input.querySelector(".graph-lists-container")).then(
            (canvas) => {
              addPageContent(canvas);
              // pdf.output("dataurlnewwindow");
              pdf.save("report.pdf"); // Save the generated PDF
            }
          );
        });
      });
    },
  }));

  return (
    <div className="container" ref={pdfRef}>
      <div className="pdf-container">
        <div className="headers">
          <div className="pdf-logo">
            <img src={Logo} />
          </div>
          <h1>Report</h1>
          <div className="selected-label">
            <div className="selected-data-1">
              <div className="comapany-details">Company Details</div>
              <div className="comapany-item">
                <p className="comapany-title">Report Name:</p>
                <p className="company-value">{TagName}</p>
              </div>
              <div className="comapany-item ">
                <p className="comapany-title">Company Name :</p>{" "}
                <p className="company-value"> {PlantName}</p>
              </div>
              <div className="comapany-item ">
                <p className="comapany-title">Address :</p>{" "}
                <p className="company-value"> {PlantAddress}</p>
              </div>
            </div>
            <div className="selected-data-2">
              <div className="comapany-details">Report Details</div>
              <div className="comapany-item ">
                <p className="comapany-title">Report Period :</p>{" "}
                <p className="company-value">
                  {" "}
                  {FromDate} to {ToDate}
                </p>
              </div>
              <div className="comapany-item ">
                <p className="comapany-title">Created By :</p>{" "}
                <p className="company-value">
                  {loggedUser.firstName + " " + loggedUser.lastName}
                </p>
              </div>
              <div className="comapany-item ">
                <p className="comapany-title">Created Date : </p>
                <p className="company-value">
                  {" "}
                  {moment().format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-report">
          <h2>Summary</h2>
          <div className="reports-table">
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
                  label: "Values",
                  width: 50,
                  responsive: true,
                  sortable: false,
                  dataTestid: "minValue",
                },
                {
                  id: "maxValue",
                  label: "Date & Time",
                  width: 50,
                  responsive: true,
                  sortable: false,
                  dataTestid: "maxValue",
                },
              ]}
              data={[
                {
                  title: "Min Value",
                  minValue: minValue,
                  maxValue: minTimestamp,
                },
                {
                  title: "Max Value",
                  minValue: maxValue,
                  maxValue: maxTimestamp,
                },
              ]}
              showPageEntryContainer={false}
              defaultOrderBy={"accountName"}
              defaultSortOrder={"asc"}
              userManage={true}
              editAction={() => {}}
              deleteAction={() => {}}
            />
          </div>
        </div>

        {/* single  row graph */}
        <div className="graph-lists-container">
          <div className="graph-list-ones">
            {chartData && (
              <NewLineChart data={chartData.data} label={chartData.labels} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default Pdf;
