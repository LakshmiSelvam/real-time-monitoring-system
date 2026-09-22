import SelectBox from "../../common/component/SelectBox";
import HomeDataCard from "../../common/component/HomeDataCard";
import "../Style/Dashboard.css";
import { useEffect, useState } from "react";
import BarChart from "../../common/Charts/BarChart.js";
import LineChart from "../../common/Charts/LineChart.js";
import ProgressBarComponent from "../../common/component/MachineComp.js";
import MachinesList from "../../common/component/Machines";

import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setBaseUrl,
  setLoggedUser,
  setSnackData,
} from "../../redux/action/userAction.js";
import { jwtDecode } from "jwt-decode";
import * as API from "../../common/api/index";
import URL from "../../common/api/constantURL.js";

function DashBoard() {
  const dispatch = useDispatch();
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const loggedUser = useSelector((state) => state.userReducer.loggedUser);
  const plantList = useSelector((state) => state.userReducer.plantList);
  const [dataCards, setDatacards] = useState([]);
  const [graphs, setGraphs] = useState([]);
  const [lines, setLines] = useState([]);
  const [plants, setPlants] = useState([]);
  const [views, setViews] = useState([]);
  const [oeeGraph, setOeeChart] = useState([]);
  const [downTimeChart, setDownTimeChart] = useState([]);
  const [showErp, setShowErp] = useState("");
  const [oeeTitle, setOeeTitle] = useState(""); // State for OEE title
  const [downTimeTitle, setDownTimeTitle] = useState("");
  const timezone = Intl.DateTimeFormat().resolvedOptions();
  localStorage.setItem("timeZone", timezone.timeZone);

  const [dataCardsVal, setDataCardsVal] = useState(false);

  useEffect(() => {
    fetchUser();
    // const intervalId = setInterval(() => {
    //   fetchUser();
    // }, 60000);
    // return () => clearInterval(intervalId);
  }, []);

  const fetchUser = async () => {
    let authToken = localStorage.getItem("authToken");
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      let userId = decodedToken.user.userId;
      const result = await API.getAPI(URL.getUserById + userId);
      dispatch(setLoading(true));
      if (result.fetchStatus === "failure") {
        dispatch(setLoading(false));
      } else {
        if (result.result.message === "success") {
          dispatch(setLoggedUser(result.result.data));
          localStorage.setItem("companyCode", result.result.data.companyCode);
          fetchBaseUrl(result.result.data.companyCode);
        } else {
          dispatch(setLoading(false));
        }
      }
    } else {
      dispatch(setLoading(false));
    }
  };

  const fetchBaseUrl = async (companyCode) => {
    let body = {
      companyCode: companyCode,
    };
    const result = await API.postAPI(URL.getBaseURL, body);
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    } else {
      if (result.result.message === "success") {
        dispatch(setBaseUrl(result.result.data.baseUrl));
        localStorage.setItem("baseURL", result.result.data.baseUrl);
        // fetchHomeData(result.result.data.baseUrl);
        fetchDataCards(result.result.data.baseUrl);
        fetchGraphData(result.result.data.baseUrl);
        fetchMachineList(result.result.data.baseUrl);
        fetchPlants(result.result.data.baseUrl);
        fetchLines(result.result.data.baseUrl);
      } else {
        dispatch(setLoading(false));
      }
    }
  };

  const fetchGraphData = async (url) => {
    let plantId;
    if (selectedValue) {
      let selectedPlant;
      if (typeof selectedValue == "number") {
        selectedPlant = plantList?.find(
          (plant) => plant.plantId == selectedValue
        );
      } else {
        selectedPlant = plantList?.find(
          (plant) => plant.plantName == selectedValue
        );
      }
      plantId = selectedPlant?.plantId;
    } else {
      plantId = localStorage.getItem("plantId");
    }
    let body = {
      plantId: parseInt(plantId),
    };
    if (plantId) {
      const result = await API.postAPI(url + URL.getGraph, body);
      if (result.fetchStatus === "failure") {
        dispatch(setLoading(false));
        setOeeTitle("");
        setDownTimeTitle("");
        setGraphs([]);
        setOeeChart([]);
        setDownTimeChart([]);
        let snackData = {
          showSnack: true,
          snackMessage: result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      } else {
        if (result.result.statusCode === 200) {
          let data = result?.result?.data;
          setOeeTitle(data.graphs[0].title);
          setDownTimeTitle(data.graphs[1].title);
          setGraphs(data.graphs);
          setOeeChart(data.graphs[0]);
          setDownTimeChart(data.graphs[1]);
        } else {
          dispatch(setLoading(false));
          setOeeTitle("");
          setDownTimeTitle("");
          setGraphs([]);
          setOeeChart([]);
          setDownTimeChart([]);
          let snackData = {
            showSnack: true,
            snackMessage: result.result.message,
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
        }
      }
    }
  };
  const fetchDataCards = async (url) => {
    setSelectedPlant(false);
    let plantId;
    if (selectedValue) {
      let selectedPlant;
      if (typeof selectedValue == "number") {
        // selectedPlant = plantList?.find((plant)=>plant.plantId == selectedValue )
        selectedPlant = localStorage.getItem("plantId");
      } else {
        selectedPlant = plantList?.find(
          (plant) => plant.plantName == selectedValue
        );
      }
      plantId = selectedPlant?.plantId;
    } else {
      plantId = localStorage.getItem("plantId");
    }

    let body = {
      plantId: parseInt(plantId),
    };

    if (plantId) {
      const result = await API.postAPI(url + URL.getDataCards, body);
      if (result.fetchStatus === "failure") {
        dispatch(setLoading(false));
        setDatacards([]);
      } else {
        if (result.result.statusCode === 200) {
          let data = result?.result?.data?.dataCards;
          setDatacards(data);
        } else {
          dispatch(setLoading(false));
          let snackData = {
            showSnack: true,
            snackMessage: result.result.message,
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
          setDatacards([]);
        }
      }
    }
  };

  const fetchMachineList = async (url) => {
    let plantId;
    if (selectedValue) {
      let selectedPlant;
      if (typeof selectedValue == "number") {
        selectedPlant = plantList?.find(
          (plant) => plant.plantId == selectedValue
        );
      } else {
        selectedPlant = plantList?.find(
          (plant) => plant.plantName == selectedValue
        );
      }
      plantId = selectedPlant?.plantId;
    } else {
      plantId = localStorage.getItem("plantId");
    }
    let body = {
      plantId: parseInt(plantId),
    };
    const result = await API.postAPI(url + URL.getMachineLive, body);
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    } else {
      if (result.result.message === "success") {
        let data = result?.result?.data;
        setViews(data);
      } else {
        dispatch(setLoading(false));
      }
    }
  };

  const fetchPlants = async (url) => {
    let plantId = localStorage.getItem("plantId");
    let body = {
      plantId: parseInt(plantId),
    };
    const result = await API.getAPI(url + URL.getPlants);
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    } else {
      if (result.result.message === "success") {
        let data = result?.result?.data;
        setPlants(data);
      } else {
        dispatch(setLoading(false));
      }
    }
  };

  const fetchLines = async (url) => {
    let plantId;
    if (selectedValue) {
      let selectedPlant = plantList?.find(
        (plant) => plant.plantId == selectedValue
      );
      plantId = selectedPlant?.plantId;
    } else {
      plantId = localStorage.getItem("plantId");
    }
    let body = {
      plantId: parseInt(plantId),
    };
    const result = await API.getAPI(url + URL.getLines);
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    } else {
      if (result.result.message === "success") {
        let data = result?.result?.data;
        setLines(data);
      } else {
        dispatch(setLoading(false));
      }
    }
  };

  const barChartLabels = downTimeChart?.label?.map((item) => item.eventTag);

  const DowntimeBarChartStyles = {
    backgroundColor: "#68B2A9",
    borderColor: "#68B2A9",
    borderWidth: 1,
    borderRadius: 7,
    barThickness: 29,
  };

  const [plantsWithLabels, setPlantsWithLabels] = useState([]);
  const [linesWithLables, setLinesWithLabels] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedPlantValue, setSelectedPlant] = useState(false);
  const [selectedValue2, setSelectedValue2] = useState("");

  useEffect(() => {
    const plantsWithLabels = plants?.map((plant) => {
      return {
        ...plant,
        value: plant.plantName,
        label: plant.plantName,
        id: plant.plantId,
      };
    });

    setPlantsWithLabels(plantsWithLabels);
    if (plantsWithLabels.length > 0) {
      setSelectedValue([plantsWithLabels[0].label]);
    }
  }, [plants]);

  useEffect(() => {
    if (plantList && plantList.length > 0) {
      let selectedPlant;
      if (typeof selectedValue == "number") {
        selectedPlant = plantList?.find(
          (plant) => plant.plantId == selectedValue
        );
      } else {
        selectedPlant = plantList?.find(
          (plant) => plant.plantName == selectedValue
        );
      }

      if (selectedPlant) {
        let certainLines = lines.filter(
          (line) => line.plantId == selectedPlant.plantId
        );
        const linesWithLables = certainLines?.map((line) => {
          return {
            ...line,
            value: line.lineName,
            label: line.lineName,
            id: line.lineId,
          };
        });
        setLinesWithLabels(linesWithLables);
        if (linesWithLables.length > 0) {
          setSelectedValue2([linesWithLables[0].label]);
        }
      }
    }
  }, [lines, selectedValue]);

  const findLine = linesWithLables?.find(
    (line) => line.lineName == selectedValue2
  );

  const displayMachine = views?.find((view) => view.line == findLine?.lineId);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDataCardsVal((prevState) => !prevState);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let url = localStorage.getItem("baseURL")
      ? localStorage.getItem("baseURL")
      : "https://demo-apps.sitesenz.com/api/dev/api/v1";
    const cardIntervalId = setInterval(() => {
      fetchDataCards(url);
    }, 1000);
    return () => {
      clearInterval(cardIntervalId);
    };
  }, []);

  useEffect(() => {
    let url = localStorage.getItem("baseURL")
      ? localStorage.getItem("baseURL")
      : "https://demo-apps.sitesenz.com/api/dev/api/v1";
    const machineInterval = setInterval(() => {
      fetchMachineList(url);
    }, 1000);
    return () => {
      clearInterval(machineInterval);
    };
  }, []);

  useEffect(() => {
    let url = localStorage.getItem("baseURL")
      ? localStorage.getItem("baseURL")
      : "https://demo-apps.sitesenz.com/api/dev/api/v1";
    const graphInterval = setInterval(() => {
      fetchGraphData(url);
    }, 50000);
    return () => {
      clearInterval(graphInterval);
    };
  }, []);

  useEffect(() => {
    if (baseURL && selectedValue) {
      fetchDataCards(baseURL);
      fetchGraphData(baseURL);
    }
  }, [baseURL, selectedValue, selectedPlantValue]);

  // useEffect(() => {
  // 	if (baseURL && selectedValue) {
  // 	  const intervalId = setInterval(() => {
  // 		fetchGraphData(baseURL);
  // 	  }, 1000);

  // 	  return () => {
  // 		clearInterval(intervalId)
  // 	};
  // 	}
  // },[dataCardsVal])

  // useEffect(() => {
  // 	let mounted = true;

  // 	const fetchData = async () => {
  // 	  if (mounted && baseURL) {
  // 		const result = await fetchDataCards(baseURL);
  // 		// Handle the result here
  // 	  }
  // 	};

  // 	const intervalId = setInterval(fetchData, 2000);

  // 	// Cleanup function to clear the interval when component unmounts
  // 	return () => {
  // 	  mounted = false;
  // 	  clearInterval(intervalId);
  // 	};
  //   }, []);

  const handleSelect = (event) => {
    const findLine = linesWithLables?.find((line) => line.lineId == event);
    setSelectedValue2(findLine.label);
  };

  const plantSelect = (event) => {
    localStorage.setItem("plantId", event);
    setSelectedPlant(true);
    setSelectedValue(event);
  };
  const formatTitle = (title) => {
    const words = title.split(/(\s+)/);
    return words.map((word, index) => (
      <span
        key={index}
        style={{ color: word.startsWith("#") ? "var(--color2)" : "white" }}
      >
        {word.startsWith("#") ? word.substring(1) : word}
      </span>
    ));
  };
  return (
    <div className="home-container">
      <div className="searchBox">
        <div className="plant-select">
          <SelectBox
            options={plantsWithLabels}
            value={selectedValue}
            handleChange={(event) => plantSelect(event)}
            className="home-select"
            defaultText={selectedValue ? selectedValue : "Select Plant"}
          />
        </div>
        <div className="machine-select">
          <SelectBox
            options={linesWithLables}
            value={selectedValue2}
            handleChange={(event) => handleSelect(event)}
            className="home-search2"
            defaultText={selectedValue2 ? selectedValue2 : "Select Mechine"}
          />
        </div>
      </div>
      <div className="body-container">
        <div className="homeCard">
          <HomeDataCard dataCards={dataCards} />
        </div>
        <div className="left">
          <div className="graph">
            <div className="graph_top_split">
              {oeeGraph?.value ? (
                <span className="bold_main">{formatTitle(oeeTitle)}</span>
              ) : (
                <span className="no-oee-data-avail">
                  No Data Available for OEE
                </span>
              )}
            </div>
            <div className="graph_bottom_split">
              <LineChart
                title={oeeTitle?.oeeTitle}
                borderRadius={"15px"}
                data={oeeGraph?.value}
                label={oeeGraph?.label}
                localizedTimeLabel={true}
              />
            </div>
          </div>

          <div className="graph">
            <div className="graph_top_split">
              {downTimeTitle ? (
                <span className="bold_main">{formatTitle(downTimeTitle)}</span>
              ) : (
                <span className="no-oee-data-avail">
                  No Data Available for DownTime
                </span>
              )}
            </div>
            <div className="graph_bottom_split">
              <BarChart
                title={downTimeTitle ? downTimeTitle : ""}
                borderRadius={"15px"}
                data={downTimeChart ? downTimeChart.value : ""}
                chartStyles={
                  DowntimeBarChartStyles ? DowntimeBarChartStyles : ""
                }
                label={barChartLabels ? barChartLabels : ""}
              />
            </div>
          </div>
        </div>
        <div className="righthalf">
          <div className="home-container-1">
            <div className="right">
              <MachinesList displayMachine={displayMachine?.machines} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashBoard;

{
  /* <div className="machines">{renderedProgressBarComponents}</div> */
}
