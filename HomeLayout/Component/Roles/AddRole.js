import InputField from "../../../common/component/InputField";
import { useState, useEffect, useRef } from "react";
import ButtonField from "../../../common/component/ButtonField";
import * as functions from "../../../common/functions/validateFunctions";
import { validateInputChange } from "../../../common/functions/validateFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setSnackData } from "../../../redux/action/userAction";
import { useNavigate, useParams } from "react-router-dom";

function AddRole({ setShowAddRolePopup, roleData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [User, setUser] = useState({
    RoleName: "",
  });

  var [validEditUserForm, setValidEditUserForm] = useState(true);
  var [errorMessage, setErrorMessage] = useState("");
  const [validRoleName, setValidRoleName] = useState(true);
  // const [role, setRole] = useState("");

  useEffect(() => {
    // Fetch role data if available
    if (roleData) {
      setUser({
        RoleName: roleData["Role Name"] || "", // Update this based on your actual data structure
      });
    }
  }, [roleData]);

  const InputHandler = (event) => {
    // console.log(event);
    event.preventDefault();
    const { name, value } = event.target;

    validateInputChange(
      event,
      (updatedValue) => {
        const updatedForm = { ...User, [name]: updatedValue };
        setUser(updatedForm);
      },
      setErrorMessage,
      "alphabetic"
    );
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (
      !functions.validateInput(
        User.RoleName.trim(),
        setErrorMessage,
        "alphabetic"
      )
    ) {
      setValidEditUserForm(false);
      return setValidRoleName(false);
    }
    if (User.RoleName.length < 1) {
      return setValidRoleName(false);
    }
    if (validRoleName) {
      let data = {
        roleName: User.RoleName.trim() || "",
      };

      var form_data = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }
    }
    let snackData = {
      showSnack: true,
      snackMessage: "Role Added Succesfully",
      snackVariant: "success",
    };
    dispatch(setSnackData(snackData));
    setShowAddRolePopup(false);
    navigate("/home/roles");
  };

  return (
    <div className="add-role-popup">
      <div className="add-role-model">
        <form className="add-role-model-content" onSubmit={formSubmitHandler}>
          <div className="add-role-title">Add Role</div>
          <div className="add-role-inputs">
            <div className="add-role-container">
              <InputField
                label="Role Name"
                type="text"
                autoFocus={true}
                name="RoleName"
                className={!validRoleName ? "invalid-error" : "input-field"}
                fieldType="input-secondary"
                placeHolderType="bold"
                placeholder="Enter Your Role Name *"
                autoComplete="off"
                value={User.RoleName}
                onChange={(event) => {
                  setValidRoleName(true);
                  setValidEditUserForm(true);
                  InputHandler(event);
                }}
              />
              <br></br>
              <span className="error-message">
                {errorMessage ? errorMessage : ""}
              </span>
            </div>
          </div>
          <div className="add-role-submit-buttons">
            <div className="role-cancel-btn">
              <ButtonField
                label="Cancel"
                onClick={() => {
                  setShowAddRolePopup(false);
                  navigate("/home/roles");
                }}
                className="add-role-cancel-btn"
              />
            </div>
            <div className="role-submit-btn">
              <ButtonField
                label="Submit"
                onClick={formSubmitHandler}
                className="add-role-submit-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddRole;
