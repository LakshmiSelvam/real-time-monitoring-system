import "../../Style/ManagePlants.css";
import { useState, useEffect } from "react";
import PlusIcon from "../../../assets/svg/plus_icon.svg";
import ButtonField from "../../../common/component/ButtonField";
import Table from "../../../common/component/Table";
import AddPlant from "./AddPlant";
import AddProduct from "./AddProduct";
import AddMachine from "./AddMachine";
import AddLine from "./AddLine.js";
import { useDispatch, useSelector } from "react-redux";
import * as API from "../../../common/api/index.js";
import {
  setLoading,
  setSnackData,
  setPlantList,
  setProductList,
  setMachineList,
  setLineList,
  setBaseUrl,
} from "../../../redux/action/userAction";
import { useNavigate } from "react-router-dom";
import Model from "../../../common/component/Model";
import URL from "../../../common/api/constantURL.js";

function ManagePlants() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const plantList = useSelector((state) => state.userReducer.plantList);
  const productList = useSelector((state) => state.userReducer.productList);
  const machineList = useSelector((state) => state.userReducer.machineList);
  const lineList = useSelector((state) => state.userReducer.lineList);
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const [plantActive, setPlantActive] = useState(true);
  const [productActive, setProductActive] = useState(false);
  const [machineActive, setMachineActive] = useState(false);
  const [lineActive, setLineActive] = useState(false);
  const [isPlantAdd, setIsPlantAdd] = useState(false);
  const [showAddPlantPopup, setShowAddPlantPopup] = useState(false);
  const [showAddProductPopup, setShowAddProductPopup] = useState(false);
  const [showAddLinePopup, setShowAddLinePopup] = useState(false);
  const [isProductAdd, setIsProductAdd] = useState(false);
  const [showAddMachinePopup, setShowAddMachinePopup] = useState(false);
  const [isMachineAdd, setIsMachineAdd] = useState(false);
  const [showDeletePopUP, setShowDeletePopUp] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isLineAdd, setIsLineAdd] = useState(false);
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [urls, setUrls] = useState("");
  // console.log("lineList", lineList);
  // console.log("plantList", plantList);
  useEffect(() => {
    fetchBaseUrl();
  }, [
    showAddPlantPopup,
    showAddProductPopup,
    showAddLinePopup,
    showAddMachinePopup,
  ]);

  const fetchBaseUrl = async () => {
    let companyCode = localStorage.getItem("companyCode");
    let body = {
      companyCode: companyCode,
    };
    const result = await API.postAPI(URL.getBaseURL, body);
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      dispatch(setLoading(false));
    } else {
      if (result.result.message === "success") {
        // console.log("vvvvvv", result.result.data.baseURL);
        setUrls(result.result.data.baseURL);
        dispatch(setBaseUrl(result.result.data.baseUrl));
        fetchPlants(result.result.data.baseUrl);
        fetchProducts(result.result.data.baseUrl);
        fetchLines(result.result.data.baseUrl);
        fetchMachines(result.result.data.baseUrl);
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    }
  };

  function updateProductsWithPlantNames(products, plants, lines, machines) {
    return products.map((product) => {
      const matchingPlant = plants.find(
        (plant) => parseInt(plant.plantId) === parseInt(product.plantId)
      );
      const matchingLine = lines.find(
        (line) => parseInt(line.lineId) === parseInt(product.lineId)
      );

      const matchingMachine = machines.find(
        (machine) => parseInt(machine.machineId) === parseInt(product.machineId)
      );

      if (matchingPlant) {
        return {
          ...product,
          plantName: matchingPlant.plantName,
          lineName: matchingLine ? matchingLine.lineName : "",
          machineName: matchingMachine ? matchingMachine.machineName : "",
        };
      }
      return product;
    });
  }
  function updateLinesWithPlantNames(lines, plants) {
    return lines.map((line) => {
      const matchingPlant = plants.find(
        (plant) => parseInt(plant.plantId) === parseInt(line.plantId)
      );

      if (matchingPlant) {
        return {
          ...line,
          plantName: matchingPlant.plantName,
        };
      }
      return line;
    });
  }
  function updateMachineWithPlantAndLineNames(machines, plants, lines) {
    return machines.map((machine) => {
      const matchingPlant = plants.find(
        (plant) => parseInt(plant.plantId) === parseInt(machine.plantId)
      );
      const matchingLine = lines.find(
        (line) => parseInt(line.lineId) === parseInt(machine.lineId)
      );

      return {
        ...machine,
        plantName: matchingPlant ? matchingPlant.plantName : "",
        lineName: matchingLine ? matchingLine.lineName : "",
      };
    });
  }

  const updatedMachines = updateMachineWithPlantAndLineNames(
    machineList,
    plantList,
    lineList
  );
  const updatedProducts = updateProductsWithPlantNames(
    productList,
    plantList,
    lineList,
    machineList
  );
  const updatedLines = updateLinesWithPlantNames(lineList, plantList);

  const fetchPlants = async (url) => {
    let result = await API.getAPI(url + "/plants/get");
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
        // console.log("plantdata", result.result.data);
        dispatch(setPlantList(result.result.data));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
  };

  const fetchProducts = async (url) => {
    let result = await API.getAPI(url + "/product/get");
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
        dispatch(setProductList(result.result.data));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
  };
  const fetchMachines = async (url) => {
    let result = await API.getAPI(url + "/machine/get");
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
        const machineList = result.result.data.map((machine) => {
          machine.isDeactivated = machine.machineStatus ? "Active" : "Inactive";
          return machine;
        });
        dispatch(setMachineList(machineList));
        // dispatch(setMachineList(result.result.data));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
  };

  const fetchLines = async (url) => {
    let result = await API.getAPI(url + "/lines/get");
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
        dispatch(setLineList(result.result.data));
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
  };
  // console.log("*****", urls);
  const editPlantDetails = async (data, page, perPage) => {
    let url = "/plants/get/";

    const result = await API.getAPI(baseURL + url + data.plantId);
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
      } else {
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
    navigate(`/home/plants/edit-plant/${data.plantId}`);
    setShowAddPlantPopup(true);
  };
  const editProductDetails = async (data, page, perPage) => {
    let url = "/product/get/";

    const result = await API.getAPI(baseURL + url + data.id);
    dispatch(setLoading(false));

    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
      } else {
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
    navigate(`/home/plants/edit-product/${data.id}`);
    setShowAddProductPopup(true);
  };

  const editLineDetails = async (data, page, perPage) => {
    let url = "/lines/get/";

    let result = await API.getAPI(baseURL + url + data.lineId);
    dispatch(setLoading(false));

    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
      } else {
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
    navigate(`/home/plants/edit-line/${data.lineId}`);
    setShowAddLinePopup(true);
  };
  // console.log("editLineDetails", editLineDetails);

  const editMachineDetails = async (data, page, perPage) => {
    let url = "/machine/get/";

    let result = await API.getAPI(baseURL + url + data.id);
    dispatch(setLoading(false));

    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: result.message,
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
    } else {
      if (result.result.message === "success") {
      } else {
        let snackData = {
          showSnack: true,
          snackMessage: result.result.message,
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
      }
    }
    navigate(`/home/plants/edit-machine/${data.id}`);
    setShowAddMachinePopup(true);
  };

  const showProductDeleteAction = async (data, page, perPage) => {
    setSelectedProduct(data.id);
    setShowDeletePopUp(true);
  };
  const showLineDeleteAction = async (data, page, perPage) => {
    setSelectedLine(data.lineId);
    setShowDeletePopUp(true);
  };

  const showMachineDeleteAction = async (data, page, perPage) => {
    setSelectedMachine(data.id);
    setShowDeletePopUp(true);
  };

  const deletePlantDetails = async (data, page, perPage) => {
    setSelectedPlant(data.plantId);
    setShowDeletePopUp(true);
  };
  const handleToggleOk = async () => {
    let url = selectedPlant
      ? "/plants/delete/"
      : selectedProduct
      ? "/product/delete/"
      : selectedLine
      ? "/lines/delete/"
      : selectedMachine
      ? "/machine/delete/"
      : "";

    let selectedId = selectedPlant
      ? selectedPlant
      : selectedProduct
      ? selectedProduct
      : selectedLine
      ? selectedLine
      : selectedMachine
      ? selectedMachine
      : "";
    // console.log("url", url);
    // console.log("id", selectedId);
    if (selectedId) {
      const result = await API.deleteAPI(baseURL + url + selectedId);
      dispatch(setLoading(true));

      if (result.fetchStatus === "failure") {
        let snackData = {
          showSnack: true,
          snackMessage: "Something Went Wrong.Contact Admin!!",
          snackVariant: "failure",
        };
        dispatch(setSnackData(snackData));
        dispatch(setLoading(false));
      } else {
        if (result.result.message === "success") {
          dispatch(setLoading(false));
          let snackData = {
            showSnack: true,
            // snackMessage: result.result.message,  || TODO
            snackMessage: "Deleted successfully",
            snackVariant: "success",
          };
          if (selectedPlant) {
            fetchPlants(baseURL);
          }
          if (selectedProduct) {
            fetchProducts(baseURL);
          }
          if (selectedLine) {
            fetchLines(baseURL);
          }
          if (selectedMachine) {
            fetchMachines(baseURL);
          }

          dispatch(setSnackData(snackData));
          setShowDeletePopUp(false);
          navigate("/home/plants");
        } else {
          let snackData = {
            showSnack: true,
            snackMessage: result.message,
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));
        }
      }
    }
  };

  // useEffect(() => {
  //   handleToggleOk(
  //     selectedPlant,
  //     selectedProduct,
  //     selectedLine,
  //     selectedMachine
  //   );
  // }, []);
  return (
    <div className="plant-container">
      <div className="plant-inner-container">
        <div className="manage-title">
          <div
            className={plantActive ? "plant-title-active" : "plant-title"}
            onClick={() => {
              setProductActive(false);
              setMachineActive(false);
              setLineActive(false);
              setPlantActive(true);
            }}
          >
            Plants
          </div>

          <div
            className={lineActive ? "line-active" : "line-title"}
            onClick={() => {
              setProductActive(false);
              setMachineActive(false);
              setPlantActive(false);
              setLineActive(true);
            }}
          >
            Line
          </div>
          <div
            className={machineActive ? "machine-active" : "machine-title"}
            onClick={() => {
              setProductActive(false);
              setMachineActive(true);
              setPlantActive(false);
              setLineActive(false);
            }}
          >
            Machine
          </div>
          <div
            className={productActive ? "product-active" : "product-title"}
            onClick={() => {
              setProductActive(true);
              setMachineActive(false);
              setPlantActive(false);
              setLineActive(false);
            }}
          >
            Product
          </div>
        </div>
        {plantActive ? (
          <div className="plant-content-container">
            <div className="add-plant-button-container">
              <ButtonField
                label="Add New Plant "
                img={PlusIcon}
                className="add-plant-button"
                onClick={() => {
                  setShowAddPlantPopup(true);
                  setIsPlantAdd(true);
                }}
              />
            </div>
            <div className="plant-list-container">
              <Table
                headers={[
                  {
                    id: "plantName",
                    label: "Plant Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "plantname",
                  },
                  {
                    id: "plantAddress",
                    label: "Plant Address",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "plantaddress",
                  },
                  {
                    id: "isDiscrete",
                    label: "isDiscrete",
                    width: 100,
                    responsive: true,
                    sortable: false,
                    dataTestid: "isDiscrete",
                  },
                  {
                    id: "manage",
                    label: "MANAGE",
                    type: "manage",
                    type: "action",
                    path: "2",
                    width: 70,
                    responsive: true,
                  },
                ]}
                tableTitle={"Total Plants"}
                data={plantList}
                showPageEntryContainer={false}
                defaultOrderBy={"PlantName"}
                defaultSortOrder={"asc"}
                editAction={(data) => {
                  editPlantDetails(data);
                }}
                userManage={false}
                deleteAction={(data) => deletePlantDetails(data)}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {productActive ? (
          <div className="plant-content-container">
            <div className="add-plant-button-container">
              <ButtonField
                label="Add New Product "
                img={PlusIcon}
                className="add-plant-button"
                onClick={() => {
                  setShowAddProductPopup(true);
                  setIsProductAdd(true);
                }}
              />
            </div>
            <div className="plant-list-container">
              <Table
                headers={[
                  {
                    id: "productId",
                    label: "Product Id",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "plantid",
                  },
                  {
                    id: "productName",
                    label: "Product Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "plantid",
                  },
                  {
                    id: "machineName",
                    label: "Machine Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "machineName",
                  },
                  {
                    id: "lineName",
                    label: "Line Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "lineName",
                  },
                  {
                    id: "plantName",
                    label: "Plant Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "plantid",
                  },
                  {
                    id: "manage",
                    label: "MANAGE",
                    type: "manage",
                    type: "action",
                    path: "2",
                    width: 70,
                    responsive: true,
                  },
                ]}
                tableTitle={"Total Products"}
                data={updatedProducts}
                showPageEntryContainer={false}
                defaultOrderBy={"accountName"}
                defaultSortOrder={"asc"}
                editAction={(data) => {
                  editProductDetails(data);
                }}
                deleteAction={(data) => showProductDeleteAction(data)}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {machineActive ? (
          <div className="plant-content-container">
            <div className="add-plant-button-container">
              <ButtonField
                label="Add New Machine "
                img={PlusIcon}
                className="add-plant-button"
                onClick={() => {
                  setShowAddMachinePopup(true);
                  setIsMachineAdd(true);
                }}
              />
            </div>
            <div className="machine-list-container">
              <Table
                headers={[
                  {
                    id: "machineName",
                    label: "Machine Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "machineName",
                  },
                  {
                    id: "machineId",
                    label: "Machine Id",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "plantid",
                  },
                  {
                    id: "plantName",
                    label: "Plant Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "plantid",
                  },
                  {
                    id: "lineName",
                    label: "Line Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "lineid",
                  },
                  {
                    id: "machineStatus",
                    label: "Machine Status",
                    type: "alarmButton",
                    width: 100,
                    responsive: true,
                    sortable: false,
                    dataTestid: "machineStatus",
                    justifyContent: "center",
                  },
                  {
                    id: "manage",
                    label: "MANAGE",
                    type: "manage",
                    type: "action",
                    path: "2",
                    width: 80,
                    responsive: true,
                  },
                ]}
                tableTitle={"Total Machine"}
                data={updatedMachines}
                showPageEntryContainer={false}
                defaultOrderBy={"accountName"}
                defaultSortOrder={"asc"}
                editAction={(data) => {
                  editMachineDetails(data);
                }}
                deleteAction={(data) => showMachineDeleteAction(data)}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {lineActive ? (
          <div className="plant-content-container">
            <div className="add-plant-button-container">
              <ButtonField
                label="Add New Line "
                img={PlusIcon}
                className="add-plant-button"
                onClick={() => {
                  setShowAddLinePopup(true);
                  setIsLineAdd(true);
                }}
              />
            </div>
            <div className="machine-list-container">
              <Table
                headers={[
                  {
                    id: "lineName",
                    label: "Line Name",
                    width: 100,
                    responsive: true,
                    sortable: true,
                    dataTestid: "lineName",
                  },
                  {
                    id: "plantName",
                    label: "Plant name",
                    width: 100,
                    responsive: true,
                    sortable: false,
                    dataTestid: "plantName",
                  },
                  {
                    id: "manage",
                    label: "MANAGE",
                    type: "manage",
                    type: "action",
                    path: "2",
                    width: 70,
                    responsive: true,
                  },
                ]}
                tableTitle={"Total Machine"}
                data={updatedLines}
                showPageEntryContainer={false}
                defaultOrderBy={"accountName"}
                defaultSortOrder={"asc"}
                editAction={(data) => {
                  editLineDetails(data);
                }}
                deleteAction={(data) => showLineDeleteAction(data)}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {showAddPlantPopup && (
          <AddPlant
            setShowAddPlantPopup={setShowAddPlantPopup}
            plantList={plantList}
          />
        )}
        {showAddProductPopup && (
          <AddProduct
            setShowAddProductPopup={setShowAddProductPopup}
            productList={productList}
            plantList={plantList}
          />
        )}
        {showAddLinePopup && (
          <AddLine
            setShowAddLinePopup={setShowAddLinePopup}
            lineList={lineList}
            plantList={plantList}
          />
        )}
        {showAddMachinePopup && (
          <AddMachine
            setShowAddMachinePopup={setShowAddMachinePopup}
            machineList={machineList}
            lineList={lineList}
            plantList={plantList}
          />
        )}
      </div>
      {showDeletePopUP ? (
        <Model
          disableCancel={false}
          onCancel={() => setShowDeletePopUp(false)}
          onOk={handleToggleOk}
          show={showDeletePopUP}
          content={`Are you sure you want to delete`}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default ManagePlants;
