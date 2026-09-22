// Import the generateLabelsForPreviousHours function from timeUtils.js
const {
  generateLabelsForPreviousHours,
} = require("../../common/component/TimeUtilsHours");

// Choose the number of hours (e.g., 12, 14, etc.)
const numberOfHour = 20;
// Generate labels for the specified number of hours
const labels24 = generateLabelsForPreviousHours(numberOfHour);

// const getRandomNumber = () => Math.floor(Math.random() * 100);

// const generateRandomNumbersArray = () => {
//   const randomNumbersArray = Array.from({ length: 11 }, getRandomNumber);
//   return randomNumbersArray;
// };

const calculateOEE = (availability, performance, quality) => {
  const oee = Math.round((availability * performance * quality) / 10000);
  return oee;
};

export const homeCardDatas = (availability, performance, quality) => {
  return [
    {
      title: "OEE",
      subTitle: "LAST 24 HRS",
      value: calculateOEE(availability, performance, quality),
      unit: "%",
    },
    {
      title: "AVAILABILITY",
      subTitle: "LAST 24 HRS",
      value: availability,
      unit: "%",
    },
    {
      title: "PERFORMANCE",
      subTitle: "LAST 24 HRS",
      value: performance,
      unit: "%",
    },
    {
      title: "QUALITY",
      subTitle: "LAST 24 HRS",
      value: quality,
      unit: "%",
    },
  ];
};

// export const generateRandomValues = () => {
//   const getPerformance = Math.floor(Math.random() * 50) + 50;
//   const getQuality = Math.floor(Math.random() * 50) + 50;
//   const getAvailability = Math.floor(Math.random() * 50) + 50;

//   return {
//     getPerformance,
//     getQuality,
//     getAvailability,
//   };
// };

export default {
  statusCode: 200,
  message: "success",
  data: {
    homeData: [
      {
        plantName: "main plant",
        isDiscrete: false,
        dataCard: {
          plantId: 1,
          dataCard: [
            {
              title: "OEE Last 24Hrs",
              value: "59677.81",
            },
            {
              title: "Availability Last 24Hrs",
              value: "3121400.00",
            },
            {
              title: "Performance Last 24Hrs",
              value: "8.75",
            },
            {
              title: "Quality Last 24Hrs",
              value: "21.85",
            },
          ],
        },
        graphs: {
          plantId: 1,
          graphs: [
            {
              title: "OEE last 24hrs",
              type: "lineChart#1/3",
              label: labels24,
              data: [10, 20, 30, 42, 51, 82, 31, 59, 61, 73, 91],
            },
            {
              title: "DownTime last 24hrs",
              type: "barChart#1/3",
              label: [
                {
                  eventTag: "TOOLG",
                  eventMessage: "Under Tooling",
                },
                {
                  eventTag: "MATL",
                  eventMessage: "Lack Of Materials",
                },
                {
                  eventTag: "UNKN",
                  eventMessage: "Unknown",
                },
                {
                  eventTag: "PWR SHUT",
                  eventMessage: "Power Issues",
                },
                {
                  eventTag: "MAINT",
                  eventMessage: "Low Maintenance",
                },
              ],
              data: [21.49, 0.04, 0.71, 55.33, 22.43],
            },
          ],
        },
        lines: [
          {
            name: "first line",
            lineData: [
              {
                machineName: "brownie_conv1",
                machineId: "brownie_conv1",
                type: "Coiling",
                availability: "25.00",
                utilisation: "Infinity",
                warnings: "EVENT_06",
                status: 1,
                plantId: 1,
                lineId: 1,
                progressData: [
                  {
                    status: 0,
                    timeSeries: [
                      {
                        startTime: "2023-09-28T10:12:58.000Z",
                        endTime: "2023-09-28T10:54:24.000Z",
                      },
                      {
                        startTime: "2023-09-28T10:54:29.000Z",
                        endTime: "2023-09-28T10:55:24.000Z",
                      },
                      {
                        startTime: "2023-09-28T10:55:54.000Z",
                        endTime: "2023-09-28T10:56:04.000Z",
                      },
                      {
                        startTime: "2023-09-28T10:59:50.000Z",
                        endTime: "2023-09-28T10:59:58.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:28:48.000Z",
                        endTime: "2023-09-28T11:28:49.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:28:55.000Z",
                        endTime: "2023-09-28T11:28:56.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:26.000Z",
                        endTime: "2023-09-28T11:29:28.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:33.000Z",
                        endTime: "2023-09-28T11:29:34.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:39.000Z",
                        endTime: "2023-09-28T11:29:41.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:45.000Z",
                        endTime: "2023-09-28T11:29:47.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:52.000Z",
                        endTime: "2023-09-28T11:29:54.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:58.000Z",
                        endTime: "2023-09-28T11:30:00.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:05.000Z",
                        endTime: "2023-09-28T11:30:06.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:11.000Z",
                        endTime: "2023-09-28T11:30:13.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:18.000Z",
                        endTime: "2023-09-28T11:30:19.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:24.000Z",
                        endTime: "2023-09-28T11:30:26.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:31.000Z",
                        endTime: "2023-09-28T11:30:32.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:37.000Z",
                        endTime: "2023-09-28T11:30:39.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:44.000Z",
                        endTime: "2023-09-28T11:30:45.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:50.000Z",
                        endTime: "2023-09-28T11:30:52.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:57.000Z",
                        endTime: "2023-09-28T11:30:58.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:03.000Z",
                        endTime: "2023-09-28T11:31:05.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:10.000Z",
                        endTime: "2023-09-28T11:31:11.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:16.000Z",
                        endTime: "2023-09-28T11:31:18.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:23.000Z",
                        endTime: "2023-09-28T11:31:25.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:30.000Z",
                        endTime: "2023-09-28T11:31:31.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:36.000Z",
                        endTime: "2023-09-28T11:31:38.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:29.000Z",
                        endTime: "2023-09-28T11:32:31.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:36.000Z",
                        endTime: "2023-09-28T11:32:37.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:42.000Z",
                        endTime: "2023-09-28T11:32:43.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:48.000Z",
                        endTime: "2023-09-28T11:32:49.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:54.000Z",
                        endTime: "2023-09-28T11:32:56.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:01.000Z",
                        endTime: "2023-09-28T11:33:03.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:07.000Z",
                        endTime: "2023-09-28T11:33:09.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:14.000Z",
                        endTime: "2023-09-28T11:33:15.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:20.000Z",
                        endTime: "2023-09-28T11:33:22.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:27.000Z",
                        endTime: "2023-09-28T11:33:28.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:33.000Z",
                        endTime: "2023-09-28T11:33:35.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:40.000Z",
                        endTime: "2023-09-28T11:33:41.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:46.000Z",
                        endTime: "2023-09-28T11:33:48.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:53.000Z",
                        endTime: "2023-09-28T11:33:54.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:59.000Z",
                        endTime: "2023-09-28T11:34:01.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:05.000Z",
                        endTime: "2023-09-28T11:34:07.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:12.000Z",
                        endTime: "2023-09-28T11:34:13.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:18.000Z",
                        endTime: "2023-09-28T11:34:20.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:25.000Z",
                        endTime: "2023-09-28T11:34:26.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:31.000Z",
                        endTime: "2023-09-28T11:34:33.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:38.000Z",
                        endTime: "2023-09-28T11:34:39.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:44.000Z",
                        endTime: "2023-09-28T11:34:46.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:51.000Z",
                        endTime: "2023-09-28T11:34:52.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:57.000Z",
                        endTime: "2023-09-28T11:34:59.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:04.000Z",
                        endTime: "2023-09-28T11:35:06.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:11.000Z",
                        endTime: "2023-09-28T11:35:12.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:17.000Z",
                        endTime: "2023-09-28T11:35:18.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:23.000Z",
                        endTime: "2023-09-28T11:35:25.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:30.000Z",
                        endTime: "2023-09-28T11:35:32.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:36.000Z",
                        endTime: "2023-09-28T11:35:38.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:43.000Z",
                        endTime: "2023-09-28T11:35:44.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:49.000Z",
                        endTime: "2023-09-28T11:35:51.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:56.000Z",
                        endTime: "2023-09-28T11:35:58.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:03.000Z",
                        endTime: "2023-09-28T11:36:04.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:09.000Z",
                        endTime: "2023-09-28T11:36:10.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:15.000Z",
                        endTime: "2023-09-28T11:36:17.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:22.000Z",
                        endTime: "2023-09-28T11:36:23.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:28.000Z",
                        endTime: "2023-09-28T11:36:30.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:35.000Z",
                        endTime: "2023-09-28T11:36:36.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:41.000Z",
                        endTime: "2023-09-28T11:36:43.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:48.000Z",
                        endTime: "2023-09-28T11:36:49.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:54.000Z",
                        endTime: "2023-09-28T11:36:56.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:01.000Z",
                        endTime: "2023-09-28T11:37:02.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:07.000Z",
                        endTime: "2023-09-28T11:37:09.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:14.000Z",
                        endTime: "2023-09-28T11:37:15.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:20.000Z",
                        endTime: "2023-09-28T11:37:22.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:27.000Z",
                        endTime: "2023-09-28T11:37:28.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:33.000Z",
                        endTime: "2023-09-28T11:37:35.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:37.000Z",
                        endTime: "2023-09-28T11:37:49.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:58.000Z",
                        endTime: "2023-09-28T11:37:59.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:02.000Z",
                        endTime: "2023-09-28T11:38:03.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:08.000Z",
                        endTime: "2023-09-28T11:38:10.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:15.000Z",
                        endTime: "2023-09-28T11:38:16.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:21.000Z",
                        endTime: "2023-09-28T11:38:23.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:27.000Z",
                        endTime: "2023-09-28T11:38:29.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:34.000Z",
                        endTime: "2023-09-28T11:38:36.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:41.000Z",
                        endTime: "2023-09-28T11:38:42.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:47.000Z",
                        endTime: "2023-09-28T11:38:49.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:53.000Z",
                        endTime: "2023-09-28T11:38:55.000Z",
                      },
                    ],
                  },
                  {
                    status: 1,
                    timeSeries: [
                      {
                        startTime: "2023-09-15T07:33:09.000Z",
                        endTime: "2023-09-28T10:12:58.000Z",
                      },
                      {
                        startTime: "2023-09-28T10:54:24.000Z",
                        endTime: "2023-09-28T10:54:29.000Z",
                      },
                      {
                        startTime: "2023-09-28T10:55:24.000Z",
                        endTime: "2023-09-28T10:55:54.000Z",
                      },
                      {
                        startTime: "2023-09-28T10:56:04.000Z",
                        endTime: "2023-09-28T10:59:50.000Z",
                      },
                      {
                        startTime: "2023-09-28T10:59:58.000Z",
                        endTime: "2023-09-28T11:28:48.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:28:49.000Z",
                        endTime: "2023-09-28T11:28:55.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:28:56.000Z",
                        endTime: "2023-09-28T11:29:26.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:28.000Z",
                        endTime: "2023-09-28T11:29:33.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:34.000Z",
                        endTime: "2023-09-28T11:29:39.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:41.000Z",
                        endTime: "2023-09-28T11:29:45.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:47.000Z",
                        endTime: "2023-09-28T11:29:52.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:29:54.000Z",
                        endTime: "2023-09-28T11:29:58.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:00.000Z",
                        endTime: "2023-09-28T11:30:05.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:06.000Z",
                        endTime: "2023-09-28T11:30:11.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:13.000Z",
                        endTime: "2023-09-28T11:30:18.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:19.000Z",
                        endTime: "2023-09-28T11:30:24.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:26.000Z",
                        endTime: "2023-09-28T11:30:31.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:32.000Z",
                        endTime: "2023-09-28T11:30:37.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:39.000Z",
                        endTime: "2023-09-28T11:30:44.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:45.000Z",
                        endTime: "2023-09-28T11:30:50.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:52.000Z",
                        endTime: "2023-09-28T11:30:57.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:30:58.000Z",
                        endTime: "2023-09-28T11:31:03.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:05.000Z",
                        endTime: "2023-09-28T11:31:10.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:11.000Z",
                        endTime: "2023-09-28T11:31:16.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:18.000Z",
                        endTime: "2023-09-28T11:31:23.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:25.000Z",
                        endTime: "2023-09-28T11:31:30.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:31.000Z",
                        endTime: "2023-09-28T11:31:36.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:31:38.000Z",
                        endTime: "2023-09-28T11:32:29.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:31.000Z",
                        endTime: "2023-09-28T11:32:36.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:37.000Z",
                        endTime: "2023-09-28T11:32:42.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:43.000Z",
                        endTime: "2023-09-28T11:32:48.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:49.000Z",
                        endTime: "2023-09-28T11:32:54.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:32:56.000Z",
                        endTime: "2023-09-28T11:33:01.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:03.000Z",
                        endTime: "2023-09-28T11:33:07.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:09.000Z",
                        endTime: "2023-09-28T11:33:14.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:15.000Z",
                        endTime: "2023-09-28T11:33:20.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:22.000Z",
                        endTime: "2023-09-28T11:33:27.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:28.000Z",
                        endTime: "2023-09-28T11:33:33.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:35.000Z",
                        endTime: "2023-09-28T11:33:40.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:41.000Z",
                        endTime: "2023-09-28T11:33:46.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:48.000Z",
                        endTime: "2023-09-28T11:33:53.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:33:54.000Z",
                        endTime: "2023-09-28T11:33:59.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:01.000Z",
                        endTime: "2023-09-28T11:34:05.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:07.000Z",
                        endTime: "2023-09-28T11:34:12.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:13.000Z",
                        endTime: "2023-09-28T11:34:18.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:20.000Z",
                        endTime: "2023-09-28T11:34:25.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:26.000Z",
                        endTime: "2023-09-28T11:34:31.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:33.000Z",
                        endTime: "2023-09-28T11:34:38.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:39.000Z",
                        endTime: "2023-09-28T11:34:44.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:46.000Z",
                        endTime: "2023-09-28T11:34:51.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:52.000Z",
                        endTime: "2023-09-28T11:34:57.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:34:59.000Z",
                        endTime: "2023-09-28T11:35:04.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:06.000Z",
                        endTime: "2023-09-28T11:35:11.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:12.000Z",
                        endTime: "2023-09-28T11:35:17.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:18.000Z",
                        endTime: "2023-09-28T11:35:23.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:25.000Z",
                        endTime: "2023-09-28T11:35:30.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:32.000Z",
                        endTime: "2023-09-28T11:35:36.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:38.000Z",
                        endTime: "2023-09-28T11:35:43.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:44.000Z",
                        endTime: "2023-09-28T11:35:49.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:51.000Z",
                        endTime: "2023-09-28T11:35:56.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:35:58.000Z",
                        endTime: "2023-09-28T11:36:03.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:04.000Z",
                        endTime: "2023-09-28T11:36:09.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:10.000Z",
                        endTime: "2023-09-28T11:36:15.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:17.000Z",
                        endTime: "2023-09-28T11:36:22.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:23.000Z",
                        endTime: "2023-09-28T11:36:28.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:30.000Z",
                        endTime: "2023-09-28T11:36:35.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:36.000Z",
                        endTime: "2023-09-28T11:36:41.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:43.000Z",
                        endTime: "2023-09-28T11:36:48.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:49.000Z",
                        endTime: "2023-09-28T11:36:54.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:36:56.000Z",
                        endTime: "2023-09-28T11:37:01.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:02.000Z",
                        endTime: "2023-09-28T11:37:07.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:09.000Z",
                        endTime: "2023-09-28T11:37:14.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:15.000Z",
                        endTime: "2023-09-28T11:37:20.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:22.000Z",
                        endTime: "2023-09-28T11:37:27.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:28.000Z",
                        endTime: "2023-09-28T11:37:33.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:35.000Z",
                        endTime: "2023-09-28T11:37:37.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:49.000Z",
                        endTime: "2023-09-28T11:37:58.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:37:59.000Z",
                        endTime: "2023-09-28T11:38:02.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:03.000Z",
                        endTime: "2023-09-28T11:38:08.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:10.000Z",
                        endTime: "2023-09-28T11:38:15.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:16.000Z",
                        endTime: "2023-09-28T11:38:21.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:23.000Z",
                        endTime: "2023-09-28T11:38:27.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:29.000Z",
                        endTime: "2023-09-28T11:38:34.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:36.000Z",
                        endTime: "2023-09-28T11:38:41.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:42.000Z",
                        endTime: "2023-09-28T11:38:47.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:49.000Z",
                        endTime: "2023-09-28T11:38:53.000Z",
                      },
                      {
                        startTime: "2023-09-28T11:38:55.000Z",
                        endTime: "2023-09-28T11:38:55.000Z",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const getOeeLast24Hrs = [
  57, 61, 71, 72, 72, 73, 73, 73, 74, 74, 74, 74, 75, 75, 75, 75, 75, 76, 76,
  76, 76, 76,
];
export const getDowntimeLast24Hrs = [
  37, 30, 25, 10, 10, 10, 10, 7, 7, 7, 7, 5, 5, 4, 4,
];
