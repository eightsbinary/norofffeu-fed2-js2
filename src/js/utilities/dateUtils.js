export function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  // Custom mapping for 3-letter month abbreviations
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = date.getDate();
  const month = monthNames[date.getMonth()]; // Get the 3-letter month abbreviation

  let formattedDate = `${day} ${month}`;

  // Add the year only if it's not the current year
  if (date.getFullYear() !== today.getFullYear()) {
    formattedDate += ` ${date.getFullYear()}`;
  }

  return formattedDate;
}
