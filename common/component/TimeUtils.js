//timeUtils.js
//Function to format the date as a string
// export const formatTime = (date) => {
//   return new Intl.DateTimeFormat("default", {
//     timeStyle: "short",
//     timeZone: "Asia/Kolkata", // You can set a specific timezone here if needed
//   })
//     .format(date)
//     .toUpperCase();
// };
export const formatTime = (date) => {
  return new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Display in 12-hour format
    timeZone: "Asia/Kolkata", // You can set a specific timezone here if needed
  })
    .format(date)
    .replace(/(am|pm)/i, "") // Remove AM/PM
    .toUpperCase();
};
