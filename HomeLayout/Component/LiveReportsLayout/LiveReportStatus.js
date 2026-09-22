import "../../Style/LiveStatus.css";
import Layout from "../../../common/component/BoxLayout";
import GraphLayout from "../../../common/component/GraphLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Area from "../../../common/Charts/Area";
import { useDispatch, useSelector } from "react-redux";
import * as API from "../../../common/api/index.js";
import URL from "../../../common/api/constantURL.js";
import {
  setLoading,
  setSnackData,
  setIndeptMachine,
} from "../../../redux/action/userAction";
import icon1 from "../../../assets/svg/Indept/icon1.svg";
import icon2 from "../../../assets/svg/Indept/icon2.svg";
import icon3 from "../../../assets/svg/Indept/icon3.svg";
import icon4 from "../../../assets/svg/Indept/icon4.svg";
import icon5 from "../../../assets/svg/Indept/icon5.svg";
import icon6 from "../../../assets/svg/Indept/icon6.svg";
import icon7 from "../../../assets/images/icon7.png";
import icon8 from "../../../assets/images/icon8.png";
import Loader from "../../../common/component/Loader.js";
function LiveReportStatus() {
  const dispatch = useDispatch();
  const params = useParams();
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const indeptMachine = useSelector((state) => state.userReducer.indeptMachine);
  const [oeeChartData, setOeeChartData] = useState("");
  const [barChartData, setBarChartData] = useState("");
  const [layoutData, setLayoutData] = useState("");
  const [topBar,setTopBar] = useState([])
  const [prod,setProd] = useState([])
  const isLoading = useSelector((state) => state.userReducer.loading);
 
  useEffect(() => {
    const fetchMachineDetails = async () => {
      if (!baseURL) return;

      let body = {
        machineId: params.machineId,
      };

      dispatch(setLoading(true));

      try {
        let result = await API.postAPI(baseURL + "/home/indepth", body);
        if (
          result.fetchStatus === "failure" ||
          result.result.message !== "success"
        ) {
          throw new Error("Failed to fetch machine details");
        }
        dispatch(setIndeptMachine(result.result.data));

        const oeeChartData = result.result.data.find(
          (item) => item.type === "LINE_CHART"
        );
        if (oeeChartData) {
          setOeeChartData(oeeChartData);
        }

        const barChartData = result.result.data.find(
          (item) => item.type === "BAR_CHART"
        );
        if (barChartData) {
          setBarChartData(barChartData);
        }

        const layoutData = result.result.data.find(
          (item) => item.type === "BOX_1" && "BOX_2"
        );
        if (layoutData) {
          setLayoutData(layoutData);
        }
      } catch (error) {
        console.error("Error fetching machine details:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMachineDetails();
  }, [baseURL]);



  useEffect(() => {
    let url = localStorage.getItem('baseURL')
    const machineInterval = setInterval(()=>{
      fetchTopBar(url);
    },1000)
    return () => {	
      clearInterval(machineInterval)
    };
  }, []);

  const fetchTopBar=async(baseURL)=>{
      let body = {
        machineId: params.machineId,
      };
    let result = await API.postAPI(baseURL + URL.getTopBarData, body);
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    }else {
      if (result.result.message === "success") {
       setTopBar(result.result.data)
       setProd(result.result.data[1])
      }
      else{
        dispatch(setLoading(false));
      }
    }
}
  const keyLabels = {
    "Product Type": icon1,
    "Batch size": icon2,
    "Line DownTime": icon3,
    "Power Consumption": icon4,
    "Motor Rpm": icon5,
    "Mixing Time": icon6,
    Temperature: icon8,
  };
console.log(prod)
  return (
    <div className="live-status-container">
      {isLoading && <Loader />}
      <div className="live-status-inner-container">
        <div className="heading-split size4to4 ">
          {topBar[0]?.data?.map((data, index) => (
            <>
              {data.label ? (
                <div className="product-headings" key={index}>
                  <div className="product-titles">
                    <img src={keyLabels[data.label]} />

                    <div className="products-title">{data.label}</div>
                  </div>
                  <div className="products">{data.value}</div>
                </div>
              ) : (
                ""
              )}
              {data.data ? (
                <div className="product-headings" key={index}>
                  <div className={data.data[0].value == "RUNNING"?"product-status-titles":data.data[0].value == "IDLE"?"product-status-titles":"product-status-titles-stopped"}>
                    <div className="products-status-title">
                      {data.data[0].label} : {data.data[0].value}
                    </div>
                    <div className="products-status-sub-title">
                      {" "}
                      {data.data[1].label} : {data.data[1].value}
                    </div>
                    <div className="products-status-sub-title2">
                      {" "}
                      {data.data[2].label} : {data.data[2].value}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ))}
        </div>
        <div className="live-status-mid-container">
          {barChartData.type === "BAR_CHART" && (
            <Area
              title={barChartData.title}
              type={barChartData.type}
              size={barChartData.size}
              label={barChartData.label}
              data={barChartData.value}
            />
          )}
          {prod?.title == 'Production Status'?
          <Layout
          title={prod.title}
          type={prod.type}
          size={prod.size}
          label={prod.label}
          data={prod.value}
        />
        :  
        
          <Layout
            title={layoutData.title}
            type={layoutData.type}
            size={layoutData.size}
            label={layoutData.label}
            data={layoutData.value}
          />
        }
        </div>
        <div className="live-status-graph-container">
          {oeeChartData.type === "LINE_CHART" && (
            <Area
              title={oeeChartData.title}
              type={oeeChartData.type}
              size={oeeChartData.size}
              label={oeeChartData.label}
              data={oeeChartData.value}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default LiveReportStatus;
