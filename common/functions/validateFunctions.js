export const validateInputChange = (
  event,
  setValueFunc,
  setErrorFunc,
  type
) => {
  setErrorFunc("");
  let value = event.target.value;
  if (!firstCharacterValidation(value)) {
    setErrorFunc("First letter cannot be space.");
    return;
  } else {
    setValueFunc(value);
  }
};
export const validateInput = (value, setErrorFunc, type, required = true) => {
  value = value + "";
  if (required && !requiredValidation(value)) {
    setErrorFunc("Required field *");
    return false;
  } else if (value.length > 0) {
    if (type === "alphabetic") {
      if (validateAlphabetRegex(value)) {
        return true;
      } else {
        setErrorFunc("Only alphabetic value allowed.");
        return false;
      }
    } else if (type === "numeric") {
      if (validateNumericRegex(value)) {
        return true;
      } else {
        setErrorFunc("Only numeric values allowed.");
        return false;
      }
    } else if (type === "decimal") {
      if (validateDecimalRegex(value)) {
        return true;
      } else {
        setErrorFunc("Only decimal values allowed.");
        return false;
      }
    } else if (type === "alphanumeric") {
      if (validateAlphaNumericRegex(value)) {
        return true;
      } else {
        setErrorFunc("Only alphanumeric values allowed.");
        return false;
      }
    } else if (type === "alphanumericWithSpecial") {
      // New validation type
      if (validateAlphaNumericWithSpecialRegex(value)) {
        return true;
      } else {
        setErrorFunc("Only letters, numbers, _, ., #, @, () allowed.");
        return false;
      }
    } else if (type === "email") {
      if (validateEmailRegex(value)) {
        return true;
      } else {
        setErrorFunc("Enter valid email address.");
        return false;
      }
    } else if (type === "timezone") {
      if (value !== "Select Timezone") {
        return true;
      } else {
        setErrorFunc("Required field *");
        return false;
      }
    } else if (type === "nonalphabet") {
      if (validateNotAlphabet(value)) {
        return true;
      } else {
        setErrorFunc("Alphabets are not allowed.");
        return false;
      }
    }
  }
  return true;
};
export const requiredValidation = (value) => {
  if (value.length > 0) {
    return true;
  }
  return false;
};

export const firstCharacterValidation = (value) => {
  if (value.charAt(0) === " ") {
    return false;
  }
  return true;
};
export function validateEmailRegex(value) {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
}
export function validateAlphaNumericRegex(value) {
  var re = /^[a-zA-Z0-9\s]+$/;
  return re.test(value);
}
export function validateAlphabetRegex(value) {
  var re = /^[A-Za-z\s]+$/;
  return re.test(value);
}
export function validateNumericRegex(value) {
  var re = /^\d+$/;
  return re.test(value);
}
export function validateDecimalRegex(value) {
  var re = /^[0-9]\d*(\.\d+)?$/;
  return re.test(value);
}
export function validateNotAlphabet(value) {
  var re = /^[^A-Za-z]+$/;
  return re.test(value);
}
export function validateAlphaNumericWithSpecialRegex(value) {
  var re = /^[a-zA-Z0-9_,. #@()]*$/;
  return re.test(value);
}
export const isRequiredBasedOnPermission = (
  data,
  rolesDetail,
  functionalRoleId
) => {
  if (parseInt(functionalRoleId) < 5) {
    return true;
  }
  let permissionIds = [];
  data.map((roleAllocations) => {
    roleAllocations &&
      roleAllocations.map((roleAllocation) => {
        if (!permissionIds.includes(roleAllocation.permissionId)) {
          permissionIds.push(roleAllocation.permissionId);
        }
      });
  });
  let check = false;
  rolesDetail.permissions &&
    rolesDetail.permissions.mobile.map((data) => {
      if (data.refName === "CAN_LOGIN") {
        let loginPermissionId = data.id;
        if (permissionIds.includes(loginPermissionId)) {
          check = true;
        }
      }
    });
  return check;
};
