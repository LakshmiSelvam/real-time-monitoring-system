// Function to convert 24-hour format to 12-hour format with AM/PM
function convertTo12HourFormat(hour) {
  return hour >= 12 ? `${hour % 12 || 12} PM` : `${hour} AM`;
}

// Function to generate labels for the previous N hours
function generateLabelsForPreviousHours(hours) {
  const currentDateIST = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const currentDate = new Date(currentDateIST);

  const labels = [];
  for (let i = hours - 1; i >= 0; i--) {
    const hour = (currentDate.getHours() - i + 24) % 24;
    labels.push(convertTo12HourFormat(hour));
  }

  return labels;
}

module.exports = {
  generateLabelsForPreviousHours,
};
