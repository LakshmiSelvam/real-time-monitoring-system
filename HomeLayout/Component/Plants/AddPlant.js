import InputField from "../../../common/component/InputField";
import ButtonField from "../../../common/component/ButtonField";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../Style/AddPlant.css";
import * as functions from "../../../common/functions/validateFunctions";
import SelectBox from "../../../common/component/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSnackData } from "../../../redux/action/userAction";
import * as API from "../../../common/api/index.js";

function AddPlant({ setShowAddPlantPopup, plantList }) {
  const dispatch = useDispatch();
  const baseURL = useSelector((state) => state.userReducer.baseURL);

  const navigate = useNavigate();
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [isedit, setIsEdit] = useState(false);
  const [validPlantName, setValidPlantName] = useState(true);
  const [validDiscreate, setValidDiscreate] = useState(true);
  const [validlocation, setValidLocation] = useState(true);
  var [validEditPlantForm, setValidEditPlantForm] = useState(true);
  const [errorPlantName, setErrorPlantName] = useState("");
  const [errorDiscreate, setErrorDiscreate] = useState("");
  const [errorLocation, setErrorLocation] = useState("");
  const [validEditUserForm, setValidEditUserForm] = useState(true);
  const [isDiscreate, setIsDescreate] = useState("");
  const [form, setForm] = useState({
    PlantName: "",
    Location: "",
    isDiscreate: "",
  });
  useEffect(() => {
    let plantData = {
      PlantName: "",
      Location: "",
      isDiscreate: "",
    };
    if (params.plantId) {
      const foundPlant = plantList.find(
        (data) => data.plantId === parseInt(params.plantId)
      );

      if (foundPlant) {
        plantData = {
          PlantName: foundPlant.plantName || "",
          Location: foundPlant.plantAddress || "",
          isDiscreate: foundPlant.isDiscrete,
        };
      }

      setForm({ ...plantData });
      setIsEdit(true);
    }
  }, [params.plantId]);

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
    if (
      !functions.validateInput(
        form.PlantName.trim(),
        setErrorPlantName,
        "alphanumeric"
      )
    ) {
      setValidEditUserForm(false);
      return setValidPlantName(false);
    }
    if (
      !functions.validateInput(
        form.Location.trim(),
        setErrorLocation,
        "alphanumericWithSpecial"
      )
    ) {
      setValidEditUserForm(false);
      return setValidLocation(false);
    }

    if (form.PlantName.length < 1) {
      return setValidPlantName(false);
    }
    if (form.Location.length < 1) {
      return setValidLocation(false);
    }
    if (form.isDiscreate.length < 1) {
      setErrorDiscreate("Required field");
      return setValidDiscreate(false);
    }
    if (validPlantName && validlocation && validDiscreate) {
      let data = {
        plantName: form.PlantName.trim() || "",
        plantAddress: form.Location.trim() || "",
        isDiscrete: form.isDiscreate || "",
      };
      let updateData = {
        plantName: form.PlantName.trim() || "",
        plantAddress: form.Location.trim() || "",
        isDiscrete: form.isDiscreate || "",
        plantId: params.plantId,
      };
      let result;
      if (!isedit) {
        result = await API.postAPI(baseURL + "/plants/create", data);
      } else {
        result = await API.patchAPI(baseURL + "/plants/update", updateData);
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
      } else {
        if (result.result.message === "success") {
          dispatch(setLoading(false));
          let successMessage = !isedit // static message need to change
            ? "Plant added successfully"
            : "Plant updated successfully";
          let snackData = {
            showSnack: true,
            // snackMessage: result.result.message, || TODO
            snackMessage: successMessage,
            snackVariant: "success",
          };
          dispatch(setSnackData(snackData));
          setShowAddPlantPopup(false);
          navigate("/home/plants");
        } else {
          let snackData = {
            showSnack: true,
            // snackMessage: result.message,  || TODO
            snackMessage: "Plant name should contain atleast 5 letters",
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));
        }
      }
    }
  };

  const options = [
    { id: "yes", value: "yes", label: "Yes" },
    { id: "no", value: "no", label: "No" },
  ];
  const handleChange = (event) => {
    setErrorDiscreate("");
    setValidEditPlantForm(true);
    setValidDiscreate(true);
    setForm({
      ...form,
      isDiscreate: event,
    });
  };
  // console.log("form", form.isDiscreate);
  return (
    <div className="add-plant-popup">
      <div className="add-plant-model">
        <form className="add-plant-model-content" onSubmit={formSubmitHandler}>
          <div className="add-plant-title">Add New Plant</div>
          <div className="add-plant-inputs">
            <div className="add-plant-container">
              <div className="plant-name-container">
                <InputField
                  label="Plant Name"
                  type="text"
                  autoFocus={true}
                  name="PlantName"
                  className={!validPlantName ? "invalid-error" : "input-field"}
                  fieldType="input-secondary"
                  placeHolderType="bold"
                  placeholder="Enter Your Plant Name *"
                  autoComplete="off"
                  value={form.PlantName}
                  onChange={(event) => {
                    setValidPlantName(true);
                    setErrorPlantName("");
                    setValidEditPlantForm(true);
                    InputHandler(event);
                  }}
                />
                <span className="error-message">
                  {errorPlantName ? errorPlantName : ""}
                </span>
              </div>
              <div className="plant-location-container">
                <InputField
                  label="Location"
                  type="text"
                  // autoFocus={true}
                  name="Location"
                  className={!validlocation ? "invalid-error" : "input-field"}
                  fieldType="input-secondary"
                  placeHolderType="bold"
                  placeholder="Enter Your  Location*"
                  autoComplete="off"
                  value={form.Location}
                  onChange={(event) => {
                    setValidLocation(true);
                    setErrorLocation("");
                    setValidEditPlantForm(true);
                    InputHandler(event);
                  }}
                />
                <span className="error-message">
                  {errorLocation ? errorLocation : ""}
                </span>
              </div>
              <div className="plant-discreate-container">
                <SelectBox
                  label="Select Discrete Type"
                  options={options}
                  value={form.isDiscreate}
                  handleChange={(event) => handleChange(event)}
                  className="home-search2"
                  defaultText={
                    form.isDiscreate ? form.isDiscreate : "Select Category"
                  }
                />
                <span className="error-message">
                  {errorDiscreate ? errorDiscreate : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="add-role-submit-buttons">
            <div className="role-cancel-btn">
              <ButtonField
                label="Cancel"
                onClick={() => {
                  setShowAddPlantPopup(false);
                  navigate("/home/plants");
                }}
                className="add-plant-cancel-btn"
              />
            </div>
            <div className="plant-submit-btn">
              <ButtonField
                label={!isedit ? "Submit" : "Update"}
                onClick={formSubmitHandler}
                className="add-plant-submit-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddPlant;
