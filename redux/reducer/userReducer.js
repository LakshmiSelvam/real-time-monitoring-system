import actiontypes from "../constant/action-types";

const initialState = {
  adminDetail: [],
  users: [],
  factory: [],
  plants: [],
  products: [],
  machines: [],
  snackResponse: {
    showSnack: false,
    snackMessage: "",
    snackVariant: "",
  },
  loading: false,
  baseURL: {},
  loggedUser: {},
  plantList: [],
  productList: [],
  machineList: [],
  lineList: [],
  indeptMachine: [],
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actiontypes.LOGIN:
      return { ...state, adminDetail: payload };
    case actiontypes.SET_USER:
      return { ...state, users: payload };
    case actiontypes.SET_FACTORY:
      return { ...state, factory: payload };
    case actiontypes.SET_PLANT:
      return { ...state, plants: payload };
    case actiontypes.SET_PRODUCT:
      return { ...state, products: payload };
    case actiontypes.SET_MACHINE:
      return { ...state, machines: payload };
    case actiontypes.SET_SNACK_DATA:
      return { ...state, snackResponse: payload };
    case actiontypes.SET_LOADING:
      return { ...state, loading: payload };
    case actiontypes.SET_BASE_URL:
      return { ...state, baseURL: payload };
    case actiontypes.SET_LOGGED_USER:
      return { ...state, loggedUser: payload };
    case actiontypes.SET_PLANT_LIST:
      return { ...state, plantList: payload };
    case actiontypes.SET_PRODUCT_LIST:
      return { ...state, productList: payload };
    case actiontypes.SET_MACHINE_LIST:
      return { ...state, machineList: payload };
    case actiontypes.SET_LINE_LIST:
      return { ...state, lineList: payload };
    case actiontypes.SET_INDEPT_MACHINE:
      return { ...state, indeptMachine: payload };
    default:
      return state;
  }
};
