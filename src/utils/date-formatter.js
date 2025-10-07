export function formatDate(value) {
  if (value == null) return "-";

  let date;
  if (typeof value === "number") {
    // tolerate seconds or ms
    date = value > 1e12 ? new Date(value) : new Date(value * 1000);
  } else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

// new: short date like "Sep 10, 2025"
export function formatDateShort(value) {
  if (value == null) return "-";

  let date;
  if (typeof value === "number") {
    date = value > 1e12 ? new Date(value) : new Date(value * 1000);
  } else {
    date = new Date(value);
  }

  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}