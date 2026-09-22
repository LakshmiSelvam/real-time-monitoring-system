import URL from "./constantURL";

let excludedURLS = [URL.login, URL.changePassword, URL.forget, URL.reset];

export function postAPI(url, data, isFormData = false) {
  return makeRequest(url, "POST", data, isFormData);
}

export function postWithFileAPI(url, data) {
  return makeRequest(url, "POST", data, true);
}

export function getAPI(url) {
  // console.log("url*****", url);
  return makeRequest(url, "GET");
}

export function deleteAPI(url, data) {
  return makeRequest(url, "DELETE", data);
}

export function putAPI(url, data) {
  return makeRequest(url, "PUT", data);
}

export function putwithFileAPI(url, data) {
  return makeRequest(url, "PUT", data, true);
}
export function patchAPI(url, data) {
  return makeRequest(url, "PATCH", data);
}
async function makeRequest(url, method, requestData = {}, isFormData = false) {
  let resultObject = {};
  let headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  // let headers = {
  //   "Content-Type": isFormData ? "multipart/form-data" : "application/json",
  // };
  // console.log("(url, method", (url, method, requestData));
  if (!excludedURLS.includes(url)) {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Handle case where token is missing or expired
      return { fetchStatus: "failure", data: "Token missing or expired" };
    }
  }

  const Getrequest = {
    method: method,
    headers: headers,
  };

  const formData = new FormData();

  formData.append("file", requestData);

  const requestOptions = {
    method: method,
    headers: headers,
    body: isFormData ? formData : JSON.stringify(requestData),
  };

  try {
    const requestOption = method === "GET" ? Getrequest : requestOptions;
    const response = await fetch(url, requestOption);
    const result = await response.json();

    if (result.statusCode === 401 && !excludedURLS.includes(url)) {
      return await refreshTokenAndRetry(url, method, requestData, isFormData);
    }

    resultObject = {
      fetchStatus: "success",
      result: result,
    };
    return resultObject;
  } catch (error) {
    console.log("error on api,", error);
    resultObject = {
      fetchStatus: "failure",
      data: error,
    };
    return resultObject;
  }
}

async function refreshTokenAndRetry(url, method, requestData, isFormData) {
  console.log("inside ref tokemn");
  const headers = {
    "Content-Type": "application/json",
  };

  // if (!localStorage.authToken) {
  //   window.location.reload();
  // }

  // try {
  const response = await fetch(URL.refreshToken, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ token: localStorage.getItem("refToken") }),
  });

  const responseParsed = await response.json();

  if (responseParsed.message == "success") {
    localStorage.setItem("authToken", responseParsed.data.authToken);
    localStorage.setItem("refToken", responseParsed.data.refreshToken);
    return await makeRequest(url, method, requestData, isFormData);
  } else {
    // localStorage.removeItem('persist:root')
    localStorage.clear();
    window.location.href = "/user/login";
    window.location.reload();
  }
  // if (
  //   responseParsed.statusCode == 401 ||
  //   responseParsed.status == "failure"
  // ) {
  //   console.log("ref token failure")
  //   localStorage.clear();
  //   window.location.href = "/user/login";
  // } else {
  //   console.log("ref token success",responseParsed.result.authToken)
  //   localStorage.setItem("authToken", responseParsed.result.authToken);
  //   localStorage.setItem("refToken", responseParsed.result.refreshToken);
  //   return await makeRequest(url, method, requestData, isFormData);
  // }
  // } catch (error) {
  //   console.log("Session Timeout, Login Again ")
  //   localStorage.clear();
  //   return {
  //     fetchStatus: "failure",
  //     data: error,
  //     message: "Session Timeout, Login Again",
  //   };
  // }
}
