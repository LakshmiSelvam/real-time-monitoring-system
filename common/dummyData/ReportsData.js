// // Import the generateLabelsForPreviousHours function from timeUtils.js
// const {
//   generateLabelsForPreviousHours,
// } = require("../components/HomePage_Machine_Compo/timeUtilsHours");
import generateLabelsForPreviousHours from "../functions/timeUtils";
// Choose the number of hours (e.g., 12, 14, etc.)
const numberOfHours = 8;
// Generate labels for the specified number of hours
const labels = generateLabelsForPreviousHours(numberOfHours);

// Choose the number of hours (e.g., 12, 14, etc.)
const numberOfHour = 24;
// Generate labels for the specified number of hours
const labels24 = generateLabelsForPreviousHours(numberOfHour);

const currentTime = new Date();

// const getRandomNumber = () => Math.floor(Math.random() * 100);

// const generateRandomNumbersArray = () => {
//   const randomNumbersArray = Array.from({ length: 11 }, getRandomNumber);
//   return randomNumbersArray;
// };

export default {
  MetricsTopBarView: [
    {
      title: "Overall Equipment Effectiveness",
      value: "70%",
      iconId: "oee-topbar-small",
    },
    {
      title: "Planned Maintenance",
      value: "10%",
      iconId: "plnedmaint-topbar-small",
    },
    {
      title: "Mean Time Between Failures",
      value: "08hours",
      iconId: "mtbf-topbar-small",
    },
    {
      title: "Scrap Rate",
      value: "8%",
      iconId: "scrate-topbar-small",
    },
    {
      title: "Machine Downtime Rate",
      value: "16%",
      iconId: "mdr-topbar-small",
    },
    {
      title: "Machine Status: ON",
      running: "02:03:15",
      productId: "GHM29001",
    },
  ],
  main: [
    {
      title: "Throughput (Rate of production)",
      type: "barChart#2/4",
      label: labels,
      data: [70, 70, 70, 70, 70, 70, 70, 71, 72, 73, 91],
    },
    {
      title: "First pass yield rate",
      type: "pieChart#1/3",
      label: ["Passed", "Failed"],
      data: [100, 50],
    },
    {
      title: "OEE- Yearly Performance Analysis",
      type: "lineChart#3/3",
      label: ["Agu", "Sep", "Oct", "Nov", "Dec"],
      data: [
        10, 20, 30, 42, 51, 82, 31, 59, 61, 73, 91, 58, 21, 45, 79, 4, 82, 26,
      ],
    },
    {
      title: "Machine Downtime Rate",
      type: "lineChart#2/4",
      label: labels,
      data: [0, 2, 5, 2, 51, 22, 1, 19, 1, 7, 23],
    },
    {
      title: "OEE LAST 24 HRS",
      type: "lineChart#1/3",
      label: labels24,
      data: [0, 2, 5, 2, 51, 22, 1, 19, 1, 7, 23],
    },
  ],
};

export const getOnlyMetricsTopBar = [
  {
    id: 1,
    title: "Overall Equipment Effectiveness",
    value: "70%",
    iconId: "oee-topbar-small",
  },
  {
    id: 2,
    title: "Planned Maintenance",
    value: "10%",
    iconId: "plnedmaint-topbar-small",
  },
  {
    id: 3,
    title: "Mean Time Between Failures",
    value: "08hours",
    iconId: "mtbf-topbar-small",
  },
  {
    id: 4,
    title: "Scrap Rate",
    value: "8%",
    iconId: "scrate-topbar-small",
  },
  {
    id: 5,
    title: "Machine Downtime Rate",
    value: "16%",
    iconId: "mdr-topbar-small",
  },
  {
    id: 6,
    title: "Machine Status: ON",
    running: currentTime,
    productId: "GHM29001",
  },
];

export const calculatePercentageValues = async (numbers) => {
  const total = numbers.reduce((acc, num) => acc + num, 0);
  const percentages = numbers.map((num) => ((num / total) * 100).toFixed(2));
  return percentages;
};

const generateBiasedRandomZeroOrOne = (threshold = 0.7) => {
  const randomDecimal = Math.random();
  return randomDecimal < threshold ? 1 : 0;
};

export const getQualityData = () => generateBiasedRandomZeroOrOne();

export const getOeeData = () => [
  37, 72, 75, 75, 75, 83, 83, 83, 85, 85, 86, 86, 87, 89, 89, 89, 89, 89, 89,
  92, 94, 94, 94, 95, 95,
];

// export const getDowtimeData = [0, 2, 5, 2, 51, 22, 1, 19, 1, 7, 23];
export const getDowtimeData = () => [
  50, 45, 25, 10, 10, 10, 10, 7, 7, 7, 7, 5, 5, 4, 4,
];

export const getThroghtData = () => [65, 65, 67, 67, 75, 88, 88, 91];
