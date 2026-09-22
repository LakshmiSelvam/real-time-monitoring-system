import InputField from "../../../common/component/InputField";
import ButtonField from "../../../common/component/ButtonField";
import { useEffect, useState } from "react";
import { validateInputChange } from "../../../common/functions/validateFunctions";
import { useNavigate, useParams } from "react-router-dom";
import SelectBox from "../../../common/component/SelectBox";
import * as functions from "../../../common/functions/validateFunctions";
import "../../Style/AddLines.css";
import { useDispatch, useSelector } from "react-redux";
import * as API from "../../../common/api/index.js";
import { setLoading, setSnackData } from "../../../redux/action/userAction";

function AddLine({ setShowAddLinePopup, lineList, plantList }) {
  const params = useParams();
  const dispatch = useDispatch();
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const [isedit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    PlantName: "",
    LineName: "",
  });

  const navigate = useNavigate();
  const [validLineName, setValidLineName] = useState(true);
  const [errorPlantName, setErrorPlantName] = useState("");
  const [errorLineName, setErrorLineName] = useState("");
  const [validEditLineForm, setValidEditLineForm] = useState(true);
  const [validPlantName, setValidPlantName] = useState(true);
  const plantsWithLabels = plantList.map((plant) => {
    return {
      ...plant,
      value: plant.plantName,
      label: plant.plantName,
      id: plant.plantId,
    };
  });
  useEffect(() => {
    if (params.lineId) {
      let lineData = {
        PlantName: "",
        LineName: "",
      };
      const foundLine = lineList.find(
        (data) => data.lineId === parseInt(params.lineId)
      );
      const foundPlant = plantList.find(
        (data) => parseInt(data.plantId) === foundLine.plantId
      );
      foundLine.plantName = foundPlant.plantName;
      if (foundLine) {
        lineData = {
          PlantName: foundLine.plantName || "",
          LineName: foundLine.lineName || "",
          LineId: foundLine.lineId || "",
        };
      }

      setForm({ ...lineData });
      setIsEdit(true);
    }
  }, [params.lineId]);

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
    if (
      !functions.validateInput(
        form.LineName.trim(),
        setErrorLineName,
        "alphanumericWithSpecial"
      )
    ) {
      setValidEditLineForm(false);
      return setValidLineName(false);
    }
    let result;
    let data = {
      plantId: form.PlantName,
      lineName: form.LineName.trim() || "",
      id: params.lineId,
    };
    let updateData = {
      lineId: parseInt(params.lineId),
      plantId: form.plantId,
      lineName: form.LineName.trim() || "",
    };
    if (!isedit) {
      result = await API.postAPI(baseURL + "/lines/create", data);
      console.log("data", result);
    } else {
      result = await API.patchAPI(
        "https://demo-apps.sitesenz.com/api/services/api/v1/lines/update",
        updateData
      );
      // console.log("updated data", result);
    }
    dispatch(setLoading(true));
    if (result.fetchStatus === "failure") {
      let snackData = {
        showSnack: true,
        snackMessage: "Something Went Wrong.Contact Admin!!",
        snackVariant: "error",
      };
      dispatch(setSnackData(snackData));
      dispatch(setLoading(false));
      setShowAddLinePopup(false);
    } else {
      if (result.result.message === "success") {
        dispatch(setLoading(false));
        let successMessage = !isedit // static message need to change
          ? "Line added successfully"
          : "Line updated successfully";
        let snackData = {
          showSnack: true,
          // snackMessage: result.result.message,  || TODO
          snackMessage: successMessage,
          snackVariant: "success",
        };
        dispatch(setSnackData(snackData));
        setShowAddLinePopup(false);
        setShowAddLinePopup(false);
      } else {
        let snackData = {
          showSnack: true,
          // snackMessage: result.result.message,  || TODO
          snackMessage: "Line name should contain atleast 5 letters",
          snackVariant: "error",
        };
        dispatch(setSnackData(snackData));
        dispatch(setLoading(false));
        setShowAddLinePopup(false);
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
  // console.log("form.PlantName", form.PlantName);
  return (
    <div className="add-line-popup">
      <div className="add-line-model">
        <form className="add-line-model-content" onSubmit={formSubmitHandler}>
          <div className="add-line-title">Add Line</div>
          <div className="add-line-inputs">
            <div className="add-line-container">
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
                <InputField
                  label="Line Name"
                  type="text"
                  name="LineName"
                  className={!validLineName ? "invalid-error" : "input-field"}
                  fieldType="input-secondary"
                  placeHolderType="bold"
                  placeholder="Enter Your Line Name *"
                  autoComplete="off"
                  value={form.LineName}
                  onChange={(event) => {
                    setValidLineName(true);
                    setValidEditLineForm(true);
                    setErrorLineName("");
                    InputHandler(event);
                  }}
                />
                <span className="error-message">
                  {errorLineName ? errorLineName : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="add-line-submit-buttons">
            <div className="line-cancel-btn">
              <ButtonField
                label="Cancel"
                onClick={() => {
                  setShowAddLinePopup(false);
                  navigate("/home/plants");
                }}
                className="add-line-cancel-btn"
              />
            </div>
            <div className="line-submit-btn">
              <ButtonField
                label="Submit"
                onClick={formSubmitHandler}
                className="add-line-submit-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddLine;
