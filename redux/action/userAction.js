import actiontypes from "../constant/action-types";

export const login = (adminDetail) => {
  return {
    type: actiontypes.LOGIN,
    payload: adminDetail,
  };
};

export const setUser = (users) => {
  return {
    type: actiontypes.SET_USER,
    payload: users,
  };
};

export const setFactory = (factory) => {
  return {
    type: actiontypes.SET_FACTORY,
    payload: factory,
  };
};

export const setPlant = (plants) => {
  return {
    type: actiontypes.SET_PLANT,
    payload: plants,
  };
};

export const setProduct = (products) => {
  return {
    type: actiontypes.SET_PRODUCT,
    payload: products,
  };
};

export const setMachine = (machines) => {
  return {
    type: actiontypes.SET_MACHINE,
    payload: machines,
  };
};

export const setSnackData = (snackResponse) => {
  snackResponse = {
    showSnack: snackResponse.showSnack,
    snackMessage: snackResponse.snackMessage,
    snackVariant: snackResponse.snackVariant,
  };
  return {
    type: actiontypes.SET_SNACK_DATA,
    payload: snackResponse,
  };
};

export const setLoading = (loading) => {
  return {
    type: actiontypes.SET_LOADING,
    payload: loading,
  };
};
export const setBaseUrl = (payload) => {
  return {
    type: actiontypes.SET_BASE_URL,
    payload: payload,
  };
};
export const setLoggedUser = (payload) => {
  return {
    type: actiontypes.SET_LOGGED_USER,
    payload: payload,
  };
};
export const setPlantList = (payload) => {
  return {
    type: actiontypes.SET_PLANT_LIST,
    payload: payload,
  };
};
export const setProductList = (payload) => {
  return {
    type: actiontypes.SET_PRODUCT_LIST,
    payload: payload,
  };
};
export const setMachineList = (payload) => {
  return {
    type: actiontypes.SET_MACHINE_LIST,
    payload: payload,
  };
};
export const setLineList = (payload) => {
  return {
    type: actiontypes.SET_LINE_LIST,
    payload: payload,
  };
};
export const setIndeptMachine = (payload) => {
  return {
    type: actiontypes.SET_INDEPT_MACHINE,
    payload: payload,
  };
};
