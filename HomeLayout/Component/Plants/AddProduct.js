import InputField from "../../../common/component/InputField";
import ButtonField from "../../../common/component/ButtonField";
import { useEffect, useState } from "react";
import { validateInputChange } from "../../../common/functions/validateFunctions";
import { useNavigate, useParams } from "react-router-dom";
import "../../Style/AddProduct.css";
import SelectBox from "../../../common/component/SelectBox";
import * as functions from "../../../common/functions/validateFunctions";
import { useDispatch, useSelector } from "react-redux";
import * as API from "../../../common/api/index.js";
import { setLoading, setSnackData } from "../../../redux/action/userAction";

const lineOptions = [
  { value: "Line1", label: "Line 1" },
  { value: "Line2", label: "Line 2" },
  // Add more line options as needed
];

const machineOptions = [
  { value: "Machine1", label: "Machine 1" },
  { value: "Machine2", label: "Machine 2" },
  // Add more line options as needed
];

function AddProduct({
  setShowAddProductPopup,
  productList,
  plantList,
  // lineList,
}) {
  const dispatch = useDispatch();
  const baseURL = useSelector((state) => state.userReducer.baseURL);

  const navigate = useNavigate();
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    PlantName: "",
    ProductId: "",
    ProductName: "",
  });
  const [validPlantName, setValidPlantName] = useState(true);
  const [validProductName, setValidProductName] = useState(true);
  const [validProductId, setValidProductId] = useState(true);
  const [errorProductName, setErrorProductName] = useState("");
  const [errorPlantName, setErrorPlantName] = useState("");
  const [errorProductId, setErrorProductId] = useState("");
  const [isedit, setIsEdit] = useState(false);
  var [validEditProductForm, setValidEditProductForm] = useState(true);
  const [errorLineName, setErrorLineName] = useState("");
  const [validLineName, setValidLineName] = useState(true);
  const [errorMachineName, setErrorMachineName] = useState("");
  const [validMachineName, setValidMachineName] = useState(true);

  const plantsWithLabels = plantList.map((plant) => {
    return {
      ...plant,
      value: plant.plantName,
      label: plant.plantName,
      id: plant.plantId,
    };
  });

  useEffect(() => {
    if (params.productId) {
      let productData = {
        PlantName: "",
        ProductId: "",
        ProductName: "",
      };
      const foundProduct = productList.find(
        (data) => data.id === parseInt(params.productId)
      );
      const foundPlant = plantList.find(
        (data) => parseInt(data.plantId) === foundProduct.plantId
      );

      foundProduct.plantName = foundPlant.plantName;
      if (foundProduct) {
        productData = {
          PlantName: foundProduct.plantName || "",
          ProductName: foundProduct.productName || "",
          ProductId: foundProduct.productId || "",
        };
      }
      setForm({ ...productData });
      setIsEdit(true);
    }
  }, [params.productId]);

  const InputHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (!form.PlantName) {
      setErrorPlantName("Plant is required");
      return setValidPlantName(false);
    }
    // if (!form.LineName) {
    //   setErrorLineName("Line is required");
    //   return setValidLineName(false);
    // }
    // if (!form.MachineName) {
    //   setErrorMachineName("Machine is required");
    //   return setValidMachineName(false);
    // }
    if (
      !functions.validateInput(
        form.ProductId.trim(),
        setErrorProductId,
        "alphanumeric"
      )
    ) {
      setValidEditProductForm(false);
      return setValidProductId(false);
    }
    if (
      !functions.validateInput(
        form.ProductName.trim(),
        setErrorProductName,
        "alphanumericWithSpecial"
      )
    ) {
      setValidEditProductForm(false);
      return setValidProductName(false);
    }
    if (form.PlantName.length < 1) {
      return setValidPlantName(false);
    }
    if (form.LineName.length < 1) {
      return setValidLineName(false);
    }
    if (form.MachineName.length < 1) {
      return setValidMachineName(false);
    }
    if (form.ProductId.length < 1) {
      return setValidProductId(false);
    }
    if (form.ProductName.length < 1) {
      return setValidPlantName(false);
    }
    if (
      validProductName &&
      validPlantName &&
      validLineName &&
      validMachineName
    ) {
      let data = {
        productId: form.ProductId.trim() || "",
        plantId: form.PlantName,
        productName: form.ProductName.trim() || "",
      };
      let updateData = {
        productId: form.ProductId.trim() || "",
        plantId: form.PlantName,
        productName: form.ProductName.trim() || "",
        id: parseInt(params.productId),
      };
      // console.log("updated", data);
      let result;
      if (!isedit) {
        result = await API.postAPI(baseURL + "/product/create", data);
      } else {
        result = await API.patchAPI(baseURL + "/product/update", updateData);
      }
      dispatch(setLoading(true));
      if (result.fetchStatus === "failure") {
        let snackData = {
          showSnack: true,
          snackMessage: "Something Went Wrong.Contact Admin!!",
          snackVariant: "success",
        };
        dispatch(setSnackData(snackData));
        dispatch(setLoading(false));
        setShowAddProductPopup(false);
      } else {
        if (result.result.message === "success") {
          dispatch(setLoading(false));
          let successMessage = !isedit // static message need to change
            ? "Product added successfully"
            : "Product updated successfully";
          let snackData = {
            showSnack: true,
            // snackMessage: result.result.message,  || TODO
            snackMessage: successMessage,
            snackVariant: "success",
          };
          dispatch(setSnackData(snackData));
          setShowAddProductPopup(false);
          setShowAddProductPopup(false);
        } else {
          let snackData = {
            showSnack: true,
            // snackMessage: result.result.message, || TODO
            snackMessage: "Product name should contain atleast 5 letters",
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));
          setShowAddProductPopup(false);
        }
      }
    }
  };
  const handleChange = (event) => {
    setErrorPlantName(false);
    setValidPlantName(true);
    setForm({
      ...form,
      PlantName: event,
    });
  };
  const handleLineChange = (event) => {
    setErrorLineName(false);
    setValidLineName(true);
    setForm({
      ...form,
      LineName: event,
    });
  };
  const handleMachineChange = (event) => {
    setErrorMachineName(false);
    setValidMachineName(true);
    setForm({
      ...form,
      MachineName: event,
    });
  };
  // console.log("fomr", form);

  return (
    <div className="add-product-popup">
      <div className="add-product-model">
        <form
          className="add-product-model-content"
          onSubmit={formSubmitHandler}
        >
          <div className="add-product-title">Add Product</div>
          <div className="add-product-inputs">
            <div className="add-product-container">
              <div className="plant-name-container">
                <SelectBox
                  label="Plant Name"
                  options={plantsWithLabels}
                  value={form.PlantName}
                  handleChange={(event) => handleChange(event)}
                  className="home-search2"
                  defaultText={form.PlantName ? form.PlantName : "Select Plant"}
                />
                <span className="error-message">
                  {errorPlantName ? errorPlantName : ""}
                </span>
              </div>
              <div className="line-name-container">
                <SelectBox
                  label="Line Name"
                  options={lineOptions}
                  value={form.LineName}
                  handleChange={(event) => handleLineChange(event)}
                  className="home-search2"
                  defaultText={form.LineName ? form.LineName : "Select Line"}
                />
                <span className="error-message">
                  {errorLineName ? errorLineName : ""}
                </span>
              </div>
              <div className="line-name-container">
                <SelectBox
                  label="Machine Name"
                  options={machineOptions}
                  value={form.MachineName}
                  handleChange={(event) => handleMachineChange(event)}
                  className="home-search2"
                  defaultText={
                    form.MachineName ? form.MachineName : "Select Machine"
                  }
                />
                <span className="error-message">
                  {errorMachineName ? errorMachineName : ""}
                </span>
              </div>
              <InputField
                label="Product ID"
                type="text"
                name="ProductId"
                className={!validProductId ? "invalid-error" : "input-field"}
                fieldType="input-secondary"
                placeHolderType="bold"
                placeholder="Enter Your Product Id *"
                autoComplete="off"
                value={form.ProductId}
                onChange={(event) => {
                  setValidProductId(true);
                  setErrorProductId("");
                  setValidEditProductForm(true);
                  InputHandler(event);
                }}
              />
              <span className="error-message">
                {errorProductId ? errorProductId : ""}
              </span>
              <InputField
                label="Product Name"
                type="text"
                name="ProductName"
                className={!validProductName ? "invalid-error" : "input-field"}
                fieldType="input-secondary"
                placeHolderType="bold"
                placeholder="Enter Your Product Name *"
                autoComplete="off"
                value={form.ProductName}
                onChange={(event) => {
                  setValidProductName(true);
                  setErrorProductName("");
                  setValidEditProductForm(true);
                  InputHandler(event);
                }}
              />
              <span className="error-message">
                {errorProductName ? errorProductName : ""}
              </span>
            </div>
          </div>
          <div className="add-product-submit-buttons">
            <div className="product-cancel-btn">
              <ButtonField
                label="Cancel"
                onClick={() => {
                  setShowAddProductPopup(false);
                  navigate("/home/plants");
                }}
                className="add-product-cancel-btn"
              />
            </div>
            <div className="product-submit-btn">
              <ButtonField
                label="Submit"
                onClick={formSubmitHandler}
                className="add-product-submit-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddProduct;
