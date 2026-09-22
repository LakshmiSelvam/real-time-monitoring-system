import InputField from "../../../common/component/InputField";
import ButtonField from "../../../common/component/ButtonField";
import { useState, useEffect } from "react";
import { validateInputChange } from "../../../common/functions/validateFunctions";
import { useNavigate, useParams } from "react-router-dom";
import SelectBox from "../../../common/component/SelectBox";
import * as functions from "../../../common/functions/validateFunctions";
import "../../Style/AddMachine.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSnackData } from "../../../redux/action/userAction";
import * as API from "../../../common/api/index.js";

function AddMachine({
  setShowAddMachinePopup,
  plantList,
  lineList,
  machineList,
}) {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseURL = useSelector((state) => state.userReducer.baseURL);
  const [isedit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    PlantName: "",
    LineName: "",
    MachineId: "",
    MachineName: "",
  });
  const [validPlantName, setValidPlantName] = useState(true);
  const [validLineName, setValidLineName] = useState(true);
  const [validMachineName, setValidMachineName] = useState(true);
  const [validMachineId, setValidMachineId] = useState(true);
  const [errorPlantName, setErrorPlantName] = useState("");
  const [errorLineName, setErrorLineName] = useState("");
  const [errorMachineId, setErrorMachineId] = useState("");
  const [errorMachineName, setErrorMachineName] = useState("");
  var [validEditMachineForm, setValidEditMachineForm] = useState(true);

  const plantsWithLabels = plantList.map((plant) => {
    return {
      ...plant,
      value: plant.plantName,
      label: plant.plantName,
      id: plant.plantId,
    };
  });

  const linesWithLabels = lineList.map((line) => {
    return {
      ...line,
      value: line.lineName,
      label: line.lineName,
      id: line.lineId,
    };
  });
  useEffect(() => {
    if (params.machineId) {
      let machineData = {
        PlantName: "",
        LineName: "",
        MachineId: "",
        MachineName: "",
      };
      const foundMachine = machineList.find(
        (data) => parseInt(data.id) === parseInt(params.machineId)
      );

      const foundPlant = plantList.find(
        (data) => parseInt(data.plantId) === foundMachine.plantId
      );

      const foundLine = lineList.find(
        (data) => parseInt(data.lineId) === foundMachine.lineId
      );

      foundMachine.plantName = foundPlant.plantName;

      if (foundMachine) {
        machineData = {
          PlantName: foundMachine.plantName || "",
          LineName: foundLine.lineName || "",
          MachineName: foundMachine.machineName || "",
          MachineId: foundMachine.machineId || "",
        };
      }

      setForm({ ...machineData });
      setIsEdit(true);
    } else {
      setForm({
        PlantName: "",
        LineName: "",
        MachineId: "",
        MachineName: "",
      });
      setIsEdit(false);
    }
  }, [params.machineId]);

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
    if (!form.LineName) {
      setErrorLineName("Line is required");
      return setValidLineName(false);
    }
    if (
      !functions.validateInput(
        form.MachineName.trim(),
        setErrorMachineName,
        "alphanumericWithSpecial"
      )
    ) {
      setValidEditMachineForm(false);
      return setValidMachineName(false);
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
    if (validPlantName && validLineName && validMachineName) {

      let data = {
        plantId: form.PlantName,
        lineId: form.LineName,
        machineName: form.MachineName.trim() || "",
        machineId: form.MachineId,
      };
      let updateData = {
        id: params.machineId,
        machineId: form.MachineId,
        lineId: form.LineName,
        plantId: form.PlantName,
        machineName: form.MachineName.trim() || "",
      };
      let result;
      if (!isedit) {
        result = await API.postAPI(baseURL + "/machine/create", data);
        // console.log("API URL:", `${baseURL}/machine/create`);
        // console.log("Request Payload:", data);
      } else {
        result = await API.patchAPI(baseURL + "/machine/update", updateData);
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
        setShowAddMachinePopup(false);
      } else {
        if (result.result.message === "success") {
          dispatch(setLoading(false));
          let successMessage = !isedit // static message need to change
            ? "Machine added successfully"
            : "Machine updated successfully";
          let snackData = {
            showSnack: true,
            // snackMessage: result.result.message,  || TODO
            snackMessage: successMessage,
            snackVariant: "success",
          };
          dispatch(setSnackData(snackData));
          setShowAddMachinePopup(false);
          setShowAddMachinePopup(false);
        } else {
          let snackData = {
            showSnack: true,
            snackMessage: result.result.message,
            // snackMessage: "Machine name should contain atleast 5 letters",
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));
          setShowAddMachinePopup(false);
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
  const handleMachineChange = (event) => {
    setErrorLineName(false);
    setValidLineName(true);
    setForm({
      ...form,
      LineName: event,
    });
  };
  // console.log("form.LineName ", form.LineName);
  return (
    <div className="add-machine-popup">
      <div className="add-machine-model">
        <form
          className="add-machine-model-content"
          onSubmit={formSubmitHandler}
        >
          <div className="add-machine-title">Add Machine</div>
          <div className="add-machine-inputs">
            <div className="add-machine-container">
              <div className="plant-name-container">
                <SelectBox
                  label="Plant Name"
                  options={plantsWithLabels}
                  value={form.PlantName}
                  handleChange={(event) => handleChange(event, "PlantName")}
                  className="home-search2"
                  defaultText={form.PlantName ? form.PlantName : "Select Plant"}
                />
                <span className="error-message">
                  {errorPlantName ? errorPlantName : ""}
                </span>
              </div>
              <div className="product-name-container">
                <SelectBox
                  label="Line Name"
                  options={linesWithLabels}
                  value={form.LineName}
                  handleChange={(event) =>
                    handleMachineChange(event, "LineName")
                  }
                  className="home-search2"
                  defaultText={form.LineName ? form.LineName : "Select Line"}
                />
                <span className="error-message">
                  {errorLineName ? errorLineName : ""}
                </span>
              </div>
              <div className="machine-name-container">
                <InputField
                  label="Machine ID"
                  type="text"
                  name="MachineId"
                  className={!validMachineId ? "invalid-error" : "input-field"}
                  fieldType="input-secondary"
                  placeHolderType="bold"
                  placeholder="Enter Your Machine Id *"
                  autoComplete="off"
                  value={form.MachineId}
                  onChange={(event) => {
                    setValidMachineId(true);
                    setErrorMachineId("");
                    setValidEditMachineForm(true);
                    InputHandler(event);
                  }}
                />
                <span className="error-message">
                  {errorMachineId ? errorMachineId : ""}
                </span>
                <InputField
                  label="Machine Name"
                  type="text"
                  name="MachineName"
                  className={
                    !validMachineName ? "invalid-error" : "input-field"
                  }
                  fieldType="input-secondary"
                  placeHolderType="bold"
                  placeholder="Enter Your Machine Name *"
                  autoComplete="off"
                  value={form.MachineName}
                  onChange={(event) => {
                    setValidLineName(true);
                    setValidEditMachineForm(true);
                    setErrorMachineName("");
                    InputHandler(event);
                  }}
                />
                <span className="error-message">
                  {errorMachineName ? errorMachineName : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="add-machine-submit-buttons">
            <div className="machine-cancel-btn">
              <ButtonField
                label="Cancel"
                onClick={() => {
                  setShowAddMachinePopup(false);
                  navigate("/home/plants");
                }}
                className="add-machine-cancel-btn"
              />
            </div>
            <div className="machine-submit-btn">
              <ButtonField
                label="Submit"
                onClick={formSubmitHandler}
                className="add-machine-submit-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddMachine;
