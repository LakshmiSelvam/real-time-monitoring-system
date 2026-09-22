// Import the generateLabelsForPreviousHours function from timeUtils.js
const {
  generateLabelsForPreviousHours,
} = require("../../common/component/TimeUtilsHours");
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
      data: [500, 30],
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
    title: "Overall Equipment Effectiveness",
    value: "76%",
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
    status: "ON",
    running: currentTime,
    productId: "GHM29001",
  },
];

export const calculatePercentageValues = async (numbers) => {
  console.log(numbers);
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

export const PiechartData = [
  { id: 1, passed: 550, failed: 2 },
  { id: 2, passed: 552, failed: 2 },
  { id: 3, passed: 553, failed: 3 },
  { id: 4, passed: 555, failed: 4 },
  { id: 5, passed: 558, failed: 5 },
  { id: 6, passed: 561, failed: 5 },
  { id: 7, passed: 564, failed: 6 },
  { id: 8, passed: 566, failed: 7 },
  { id: 9, passed: 569, failed: 8 },
  { id: 10, passed: 571, failed: 9 },
  { id: 11, passed: 574, failed: 9 },
  { id: 12, passed: 576, failed: 10 },
  { id: 13, passed: 578, failed: 11 },
  { id: 14, passed: 580, failed: 11 },
  { id: 15, passed: 583, failed: 11 },
  { id: 16, passed: 584, failed: 11 },
  { id: 17, passed: 586, failed: 12 },
  { id: 18, passed: 588, failed: 12 },
  { id: 19, passed: 589, failed: 13 },
  { id: 20, passed: 591, failed: 14 },
  { id: 21, passed: 593, failed: 15 },
  { id: 22, passed: 595, failed: 16 },
  { id: 23, passed: 598, failed: 16 },
  { id: 24, passed: 600, failed: 16 },
  { id: 25, passed: 601, failed: 17 },
  { id: 26, passed: 603, failed: 17 },
  { id: 27, passed: 605, failed: 18 },
  { id: 28, passed: 607, failed: 19 },
  { id: 29, passed: 609, failed: 20 },
  { id: 30, passed: 612, failed: 20 },
  { id: 31, passed: 614, failed: 20 },
  { id: 32, passed: 617, failed: 21 },
  { id: 33, passed: 619, failed: 21 },
  { id: 34, passed: 620, failed: 21 },
  { id: 35, passed: 622, failed: 21 },
  { id: 36, passed: 623, failed: 22 },
  { id: 37, passed: 625, failed: 22 },
  { id: 38, passed: 628, failed: 23 },
  { id: 39, passed: 630, failed: 23 },
  { id: 40, passed: 632, failed: 24 },
  { id: 41, passed: 635, failed: 24 },
  { id: 42, passed: 637, failed: 24 },
  { id: 43, passed: 639, failed: 25 },
  { id: 44, passed: 640, failed: 25 },
  { id: 45, passed: 643, failed: 25 },
  { id: 46, passed: 644, failed: 25 },
  { id: 47, passed: 646, failed: 26 },
  { id: 48, passed: 648, failed: 26 },
  { id: 49, passed: 650, failed: 27 },
  { id: 50, passed: 651, failed: 28 },
  { id: 51, passed: 653, failed: 29 },
  { id: 52, passed: 655, failed: 29 },
  { id: 53, passed: 658, failed: 30 },
  { id: 54, passed: 660, failed: 30 },
  { id: 55, passed: 663, failed: 31 },
  { id: 56, passed: 666, failed: 31 },
  { id: 57, passed: 668, failed: 32 },
  { id: 58, passed: 669, failed: 33 },
  { id: 59, passed: 670, failed: 33 },
  { id: 60, passed: 672, failed: 33 },
  { id: 61, passed: 675, failed: 33 },
  { id: 62, passed: 677, failed: 33 },
  { id: 63, passed: 678, failed: 33 },
  { id: 64, passed: 680, failed: 34 },
  { id: 65, passed: 683, failed: 35 },
  { id: 66, passed: 684, failed: 36 },
  { id: 67, passed: 687, failed: 36 },
  { id: 68, passed: 689, failed: 36 },
  { id: 69, passed: 692, failed: 37 },
  { id: 70, passed: 693, failed: 37 },
  { id: 71, passed: 695, failed: 38 },
  { id: 72, passed: 697, failed: 38 },
  { id: 73, passed: 699, failed: 38 },
  { id: 74, passed: 701, failed: 39 },
  { id: 75, passed: 702, failed: 40 },
  { id: 76, passed: 704, failed: 40 },
  { id: 77, passed: 705, failed: 40 },
  { id: 78, passed: 707, failed: 40 },
  { id: 79, passed: 708, failed: 41 },
  { id: 80, passed: 710, failed: 42 },
  { id: 81, passed: 712, failed: 43 },
  { id: 82, passed: 713, failed: 43 },
  { id: 83, passed: 715, failed: 43 },
  { id: 84, passed: 717, failed: 44 },
  { id: 85, passed: 718, failed: 45 },
  { id: 86, passed: 720, failed: 46 },
  { id: 87, passed: 721, failed: 46 },
  { id: 88, passed: 723, failed: 46 },
  { id: 89, passed: 725, failed: 47 },
  { id: 90, passed: 727, failed: 47 },
  { id: 91, passed: 728, failed: 47 },
  { id: 92, passed: 730, failed: 48 },
  { id: 93, passed: 732, failed: 49 },
  { id: 94, passed: 735, failed: 50 },
  { id: 95, passed: 737, failed: 51 },
  { id: 96, passed: 739, failed: 51 },
  { id: 97, passed: 740, failed: 51 },
  { id: 98, passed: 741, failed: 51 },
  { id: 99, passed: 743, failed: 52 },
  { id: 100, passed: 745, failed: 52 },
];
