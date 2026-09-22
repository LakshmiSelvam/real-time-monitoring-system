import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import "../../Style/Pdf.css";
import GraphLayout from "../../../common/component/GraphLayout";
import Table from "../../../common/component/Table";
import moment from "moment";
import Logo from "../../../assets/images/pdf-logo.png"
import MultiLine from "../../../common/Charts/MultiLineChart"
import {setLoggedUser} from "../../../redux/action/userAction"
import {  useSelector } from "react-redux";
const Pdf = forwardRef((props, ref) => {
	const loggedUser = useSelector((state) => state.userReducer.loggedUser);
  let PlantName = props.PlantName;
  let LineName = props.LineName;
  let MachineName = props.MachineName;
  let PlantLevel = props.PlantLevel;
  let PlantAddress = props.PlantAddress
  let LineLevel = props.LineLevel;
  let FromDate = props.FromDate;
  let ToDate = props.ToDate;
  let oEETitle = props.oEETitle;
  let oEELable = props.oEELable;
  let oEEData = props.oEEData;

  let qualityTitle = props.qualityTitle;
  let qualityLable = props.qualityLable;
  let qualityData = props.qualityData;
  let powerTitle = props.powerTitle;
  let powerLable = props.powerLable;
  let powerData = props.powerData;
  let type = props.type;
  

  const pdfRef = useRef();

  useImperativeHandle(ref, () => ({
    handlePDF() {
      const input = pdfRef.current;
      const pdf = new jsPDF("p", "mm", "a4", true);
      pdf.setLineWidth(0.5); // Adjust the width as needed
      pdf.setDrawColor(0); // Set the draw color to black
      
      // Draw a rectangle around the page
    //   pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'S'); // 'S' stands for stroke
      
      let yOffset = 10;
      const addPageContent = (canvas) => {
        const imgData = canvas.toDataURL("imgae/png");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
		
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
		// pdf.rect(1, yOffset - 5, pdfWidth - 3, imgHeight * ratio + 8)
		// pdf.rect(1, 1, pdfWidth-1, pdfHeight-1);
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
        html2canvas(input.querySelector(".table-report")).then(
          (canvas) => {
            addPageContent(canvas);
            // const graphListsContainer2 = input.querySelector(".graph-lists-container");
            // if (graphListsContainer2.clientHeight + yOffset > pdf.internal.pageSize.getHeight()) {
            //   pdf.addPage();
            //   yOffset = 10;
            // }
            html2canvas(input.querySelector(".graph-lists-container")).then(
              (canvas) => {
				
                addPageContent(canvas);
				const graphListsContainer2 = input.querySelector(".graph-lists-container2");
				if (graphListsContainer2.clientHeight + yOffset > pdf.internal.pageSize.getHeight()) {
					pdf.addPage();
					yOffset = 10;
				}
                html2canvas(input.querySelector(".graph-lists-container2")).then(
                  (canvas) => {
					
                    addPageContent(canvas);
                    // pdf.output("dataurlnewwindow");
                    pdf.save('report.pdf'); // Save the generated PDF
                  });
              });
          });
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
  const findMinDate = (item) => {
    if (!item.value || item.value.length === 0) return "";
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
        default:
          value = 0;
      }
      return isNaN(value) ? Infinity : value; // Replace NaN with Infinity for comparison
    });
  
    const minValue = Math.min(...values);
    const minIndex = values.indexOf(minValue);
    const minDate = (item.value[minIndex]).timeStamp
    return minDate
  };
  const findMaxDate = (item) => {
    if (!item.value || item.value.length === 0) return "";
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
        default:
          value = 0;
      }
      return isNaN(value) ? Infinity : value; // Replace NaN with Infinity for comparison
    });
  
    const maxValue = Math.max(...values);
    const maxIndex = values.indexOf(maxValue);
    const maxDate = (item.value[maxIndex]).timeStamp
    return maxDate
  };
  const localizeTimestamp = (timestamp) => {
    if (!timestamp) return ""; // Added check for undefined or null timestamp
    const timezone = localStorage.getItem("timeZone");
    const dateInUTC = new Date(timestamp);
    return dateInUTC.toLocaleString("en-US", {
      timeZone: timezone,
      day:"2-digit",
      month:"short",
      year:"numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };
  return (
    <div className="container" ref={pdfRef}>
      <div className="pdf-container">
        <div className="headers">
			<div  className="pdf-logo">
			<img src={Logo} />
			</div>
          <h1>Report</h1>
          <div className="selected-label">
            <div className="selected-data-1">
				<div className="comapany-details">
					Company Details
				</div>
				<div className="comapany-item ">
					<p className="comapany-title">Company Name :</p> <p className="company-value"> {PlantName}</p>
				</div>
				<div className="comapany-item ">
					<p className="comapany-title">Address :</p>  <p className="company-value"> {PlantAddress}</p>
				</div>
             
            </div>
            <div className="selected-data-2">
				<div className="comapany-details">
					Report Details
				</div>
				{type == 'multiple'?"":
					<>
						<div className="comapany-item ">
							<p className="comapany-title">Line :</p>  <p className="company-value">{LineName}</p>
						</div>
						<div className="comapany-item ">
							<p className="comapany-title">Machine :</p>  <p className="company-value">{MachineName}</p>
						</div>
					</>
				}
				<div className="comapany-item ">
					<p className="comapany-title">Report Period :</p> <p className="company-value"> {FromDate } to {ToDate}</p>
				</div>
				<div className="comapany-item ">
			  	    <p className="comapany-title">Created By :</p> <p className="company-value">{loggedUser.firstName + ' '+ loggedUser.lastName}</p>
				</div>
				<div className="comapany-item ">
					<p className="comapany-title">Created Date : </p><p className="company-value"> {moment().format("DD-MM-YYYY")}</p>
				</div>
              
            </div>
          </div>
        </div>
		<div className="table-report">
		<h2>Summary</h2>
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
                minValue:findMinValue(item)+' @ '+localizeTimestamp(findMinDate(item)),
                maxValue: findMaxValue(item) + ' @ ' + localizeTimestamp(findMaxDate(item)),
                // minDate:localizeTimestamp(findMinDate(item)),
                // maxDate: localizeTimestamp(findMaxDate(item)),
              }))}
              showPageEntryContainer={false}
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
		</div>
	    
		<>
		 {/* single  row graph */}
        <div className="graph-lists-container">
          <div className="graph-list-ones">
            <h3>Overall Equipment Effectiveness </h3>
            <div className="charts-container">
              <div className="history-status-mid-container">
			  {type == 'multiple'?
				<MultiLine 
					data={oEEData}
					labels={oEELable}
					localizedTimeLabel={true}
          linesWithLabels = {props.linesWithLabels}
				/> 
			  :
                <GraphLayout
                fileType="report"
                  type="LINE_CHART"
                  size="4/4"
                  title={oEETitle}
                  label={oEELable}
                  data={oEEData}
                  localizedTimeLabel={true}
                  xAxisColor="black"
                  yAxisColor="black"
                  borderColor="#23511E"
                />}
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
			  {type == 'multiple'?
				<MultiLine 
					data={qualityData}
					labels={qualityLable}
					localizedTimeLabel={true}
          linesWithLabels = {props.linesWithLabels}
				/> 
			  :
                <GraphLayout
                fileType="report"
                  type="LINE_CHART"
                  size="4/4"
                  title={qualityTitle}
                  label={qualityLable}
                  data={qualityData}
                  localizedTimeLabel={true}
                  xAxisColor="black"
                  yAxisColor="black"
                  borderColor="#8F4700"
                />
				}
              </div>
            </div>
          </div>
		 
          <div className="graph-list-two">
            <h3>Power Consumptions</h3>
            <div className="charts-container">
              <div className="history-status-mid-container">
			  {type == 'multiple'?
				<MultiLine 
					data={powerData}
					labels={powerLable}
					localizedTimeLabel={true}
          linesWithLabels = {props.linesWithLabels}
				/> 
			  :
                <GraphLayout
                fileType="report"
                  type="LINE_CHART"
                  size="4/4"
                  title={powerTitle}
                  label={powerLable}
                  data={powerData}
                  localizedTimeLabel={true}
                  xAxisColor="black"
                  yAxisColor="black"
                  borderColor="#002F5D"
                  
                />
				}
              </div>
            </div>
          </div>
		  </div>
		  </>
		  {/* single graph end */}
    
      </div>
    </div>
  );
});
export default Pdf;