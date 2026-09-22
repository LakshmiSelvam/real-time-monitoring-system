import InputField from "../../../common/component/InputField";
import BlankProfie from "../../../assets/images/blankUserProfile.png";
import { useState, useEffect, useRef } from "react";
import ButtonField from "../../../common/component/ButtonField";
import SelectBox from "../../../common/component/SelectBox";
import * as functions from "../../../common/functions/validateFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setSnackData } from "../../../redux/action/userAction";
import { useNavigate, useParams } from "react-router-dom";
import URL from "../../../common/api/constantURL";
import * as API from "../../../common/api/index";
import { setLoading } from "../../../redux/action/userAction";

function AddUser({ setShowAddUserPopup }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  var [image, setImage] = useState("");
  const fileUpload = useRef(null);
  var [removeProfilePicture, setRemoveProfilePicture] = useState(false);
  var [validEditUserForm, setValidEditUserForm] = useState(true);
  var [errorMessage, setErrorMessage] = useState("");
  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validPhoneNumber, setValidPhoneNumber] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validCompanycode, setValidCompanycode] = useState(true);
  const [validRole, setValidRole] = useState(true);
  const [role, setRole] = useState("");
  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorPhoneNumber, setErrorPhoneNumber] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [ErrorCompanycode, setErrorCompanycode] = useState("");
  const [errorRole, setErrorRole] = useState("");
  const [imgError, setImgError] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [User, setUser] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Mobile: "",
    Image: "",
    Companycode: "",
    Role: "",
  });
  const users = useSelector((state) => state.userReducer.users);

  useEffect(() => {
    let userdata = {
      FirstName: "",
      LastName: "",
      Email: "",
      Mobile: "",
      Image: "",
      Companycode: "",
      Role: "",
    };
    if (params.userId) {
      const foundUser = users.find((user) => user.userId === params.userId);
      if (foundUser) {
        userdata = {
          Email: foundUser.email || "",
          FirstName: foundUser.firstName || "",
          Image: foundUser.profileUrl,
          LastName: foundUser.lastName || "",
          Mobile: foundUser.mobile || "",
          Role: foundUser.userRole || "",
          Companycode: foundUser.companyCode || "",
        };
      }
      setUser({ ...userdata });
      setImage(userdata.Image);
      setIsEdit(true);
    }
  }, [params.userId]);
  // console.log("edit", isEdit);
  // console.log("user", User);
  const handleFileChange = () => {
    let validFileExtensions = ["image/jpg", "image/jpeg", "image/png"];
    if (fileUpload.current.value != "") {
      // console.log("fileUpload", fileUpload.current.files[0]);
      if (validFileExtensions.includes(fileUpload.current.files[0].type)) {
        var file = fileUpload.current.files[0];
        const fileSize = file.size / 1024 / 1024;
        if (fileSize > 3) {
          setValidEditUserForm(false);
          return setImgError("Please upload a file smaller than 3 MB.");
        }
        var reader = new FileReader();
        // console.log("url", url);
        var url = reader.readAsDataURL(file);
        // console.log("FileReader", reader);
        reader.onloadend = function (e) {
          // console.log("reader", reader.result);
          setImage(reader.result);
        };
      } else {
        fileUpload.current.value = "";
        setValidEditUserForm(false);
        setImgError("Upload file with JPG, PNG, JPEG format");
      }
    }
  };
  // console.log("handleFileChange", image);
  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (
      !functions.validateInput(
        User.FirstName.trim(),
        setErrorFirstName,
        "alphabetic"
      )
    ) {
      setValidEditUserForm(false);
      return setValidFirstName(false);
    }
    if (
      !functions.validateInput(
        User.LastName.trim(),
        setErrorLastName,
        "alphabetic"
      )
    ) {
      setValidEditUserForm(false);
      return setValidLastName(false);
    }
    if (
      !functions.validateInput(
        User.Companycode.trim(),
        setErrorCompanycode,
        "alphanumeric"
      )
    ) {
      setValidEditUserForm(false);
      return setValidCompanycode(false);
    }
    if (User.Role === "") {
      setValidEditUserForm(false);
      setErrorRole("Please Select Role");
      return setValidRole(false);
    }
    if (
      !functions.validateInput(
        User.Mobile,
        setErrorPhoneNumber,
        "nonalphabet",
        false
      )
    ) {
      setValidEditUserForm(false);
      return setValidPhoneNumber(false);
    }
    if (!functions.validateInput(User.Email, setErrorEmail, "email")) {
      setValidEditUserForm(false);
      return setValidEmail(false);
    }
    if (User.FirstName.length < 1) {
      return setValidFirstName(false);
    }
    if (User.LastName.length < 1) {
      return setValidLastName(false);
    }
    if (User.Mobile.length < 1) {
      return setValidPhoneNumber(false);
    }
    if (User.Email.length < 1) {
      return setValidEmail(false);
    }
    if (User.Companycode.length < 1) {
      return setValidCompanycode(false);
    }
    if (
      validFirstName &&
      validLastName &&
      validEmail &&
      validPhoneNumber &&
      validCompanycode &&
      validRole
    ) {
      let data = {
        email: User.Email.trim() || "",
        firstName: User.FirstName.trim() || "",
        lastName: User.LastName.trim() || "",
        companyCode: User.Companycode.trim() || "",
        role: User.Role || "",
        mobile: User.Mobile,
      };
      let editData = {
        userId: params.userId,
        firstName: User.FirstName.trim() || "",
        lastName: User.LastName.trim() || "",
        mobile: User.Mobile,
      };

      let result;
      // Check the mode to decide whether to add or update the user
      // console.log("edited data", data);
      if (!isEdit) {
        result = await API.postAPI(URL.addUser, data);
      } else {
        result = await API.patchAPI(URL.updateUser, editData);
      }

      dispatch(setLoading(true));
      if (result.fetchStatus === "failure") {
        setErrorMessage("Server down.Failed to fetch");
        let successMessage = !isEdit ? "User not added" : "User not updated"; // static message need to change
        let snackData = {
          showSnack: true,
          // snackMessage: result.message,  || TODO
          snackMessage: successMessage,
          snackVariant: "success",
        };
        dispatch(setSnackData(snackData));
        dispatch(setLoading(false));
      } else {
        if (result.result.message === "success") {
          dispatch(setLoading(false));
          let successMessage = !isEdit // static message need to change
            ? "User added successfully"
            : "User updated successfully";
          let snackData = {
            showSnack: true,
            // snackMessage: result.message,      || TODO
            snackMessage: successMessage,
            snackVariant: "success",
          };
          dispatch(setSnackData(snackData));
          // dispatch(fetchUsers());
        } else {
          let snackData = {
            showSnack: true,
            // snackMessage: result.message,   || TODO
            snackMessage: "Missing API Input Key ", // static message need to change
            snackVariant: "error",
          };
          dispatch(setSnackData(snackData));
          dispatch(setLoading(false));
        }
      }

      if (fileUpload.current.files.length > 0) {
        const fileSize = fileUpload.current.files.size / 1024 / 1024;
        if (fileSize > 3) {
          setValidEditUserForm(false);
          setImgError("Please upload a file smaller than 3 MB.");
        } else {
          result = await API.postAPI(
            URL.uploadProfile,
            fileUpload.current.files[0],
            true
          );
        }
      }
    }
    setShowAddUserPopup(false);
    navigate("/home/users");
  };

  const InputHandler = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    const updatedForm = {
      ...User,
      [name]: value,
    };
    setUser(updatedForm);
  };

  const options = [
    { id: 1, value: 1, label: "Admin" },
    { id: 2, value: 2, label: "Manager" },
    { id: 3, value: 3, label: "Operator" },
  ];

  const handleChange = (event) => {
    setErrorRole("");
    setUser({
      ...User,
      Role: event,
    });
  };
  // console.log("img", User);
  return (
    <div className="add-user-popup">
      <div className="add-user-model">
        <form className="add-user-model-content" onSubmit={formSubmitHandler}>
          <div className="add-user-title">Add User</div>
          <div className="add-user-model-inner-content">
            <div className="add-user-input-content">
              <div className="add-user-profile">
                <div className="image-container">
                  <div className="add-profile-image-container">
                    <img
                      className="user-image-view"
                      // src={User.Image ? User.Image : BlankProfie}
                      src={image ? image : BlankProfie}
                      onClick={() => {
                        fileUpload.current.click();
                        setImgError("");
                        setRemoveProfilePicture(false);
                      }}
                    />
                    {image && image.length > 0 && (
                      <span
                        className="inner-x add-user-inner-x"
                        title="Remove Profile"
                        onClick={() => {
                          setImage("");
                          setRemoveProfilePicture(true);
                        }}
                      >
                        &times;
                      </span>
                    )}
                  </div>
                  <p className="change-pic-span">
                    {image ? "Change Photo" : "Upload Photo"}
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="image-file-upload-input"
                    ref={fileUpload}
                    onChange={() => {
                      setValidEditUserForm(true);
                      handleFileChange();
                    }}
                  />
                  <span className="user-error-msg">
                    {imgError ? imgError : ""}
                  </span>
                </div>
              </div>
              <div className="add-user-email">
                <InputField
                  label="Email"
                  type="email"
                  autoFocus={true}
                  name="Email"
                  placeHolderType="bold"
                  placeholder="Enter Your Email Address *"
                  autoComplete="off"
                  value={User.Email}
                  className={!validEmail ? "invalid-error" : "input-field"}
                  onChange={(event) => {
                    setValidEmail(true);
                    setValidEditUserForm(true);
                    setErrorEmail("");
                    InputHandler(event);
                  }}
                  // restricted to edit the email
                  disabled={isEdit}
                />
                <span className="user-error-msg">
                  {errorEmail ? errorEmail : ""}
                </span>
              </div>
              <div className="add-user-companycode">
                <InputField
                  label="Company Code"
                  autoComplete="off"
                  type="text"
                  maxLength="8" // Set the maximum length for the company code
                  name="Companycode"
                  className="input-field"
                  placeHolderType="bold"
                  placeholder="Enter your companycode"
                  value={User.Companycode}
                  onChange={(event) => {
                    setErrorCompanycode("");
                    setValidEditUserForm(true);
                    InputHandler(event);
                  }}
                  // restricted to edit the company code
                  disabled={isEdit}
                />
              </div>
              <span
                data-testid="companycode-error-field"
                className="error-message"
              >
                {ErrorCompanycode && ErrorCompanycode}
              </span>

              <div className="role-title">Role</div>
              <div className="add-user-role">
                <SelectBox
                  options={options}
                  name="Role"
                  defaultText="Select Role"
                  handleChange={(event) => handleChange(event)}
                  value={User.Role}
                  onChange={(event) => {
                    setRole(event);
                    setErrorRole("");
                    setValidEditUserForm(true);
                  }}
                  className={!validRole ? "invalid-error" : "role-dropdown"}
                />
                <span className="user-error-msg">
                  {errorRole ? errorRole : ""}
                </span>
              </div>
            </div>
            <div className="add-user-inputs">
              <div className="add-user-firstname">
                <InputField
                  label="First Name"
                  type="text"
                  // autoFocus={true}
                  name="FirstName"
                  className={!validFirstName ? "invalid-error" : "input-field"}
                  fieldType="input-secondary"
                  placeHolderType="bold"
                  placeholder="Enter Your First Name *"
                  autoComplete="off"
                  value={User.FirstName}
                  onChange={(event) => {
                    setValidFirstName(true);
                    setValidEditUserForm(true);
                    setErrorFirstName("");
                    InputHandler(event);
                  }}
                />
                <span className="user-error-msg">
                  {errorFirstName ? errorFirstName : ""}
                </span>
              </div>
              <div className="add-user-lastname">
                <InputField
                  label="Last Name"
                  type="text"
                  // autoFocus={true}
                  name="LastName"
                  placeHolderType="bold"
                  placeholder="Enter Your Last Name *"
                  autoComplete="off"
                  className={!validLastName ? "invalid-error" : "input-field"}
                  value={User.LastName}
                  onChange={(event) => {
                    setValidLastName(true);
                    setValidEditUserForm(true);
                    setErrorLastName("");
                    InputHandler(event);
                  }}
                />
                <span className="user-error-msg">
                  {errorLastName ? errorLastName : ""}
                </span>
              </div>
              <div className="add-user-phone">
                <InputField
                  label="Phone Number"
                  type="text"
                  // autoFocus={true}
                  name="Mobile"
                  placeHolderType="bold"
                  placeholder="Enter Your Phone Number *"
                  autoComplete="off"
                  value={User.Mobile}
                  className={
                    !validPhoneNumber ? "invalid-error" : "input-field"
                  }
                  onChange={(event) => {
                    setValidPhoneNumber(true);
                    setValidEditUserForm(true);
                    setErrorPhoneNumber("");
                    InputHandler(event);
                  }}
                />
                <span className="user-error-msg">
                  {errorPhoneNumber ? errorPhoneNumber : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="add-user-submit-buttons">
            <div className="user-cancel-btn">
              <ButtonField
                label="Cancel"
                onClick={() => {
                  setShowAddUserPopup(false);
                  navigate("/home/users");
                }}
                className="add-user-cancel-btn"
              />
            </div>
            <div className="user-submit-btn">
              <ButtonField
                label={isEdit ? "Update" : "Submit"}
                onClick={formSubmitHandler}
                className="add-user-submit-btn"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddUser;
