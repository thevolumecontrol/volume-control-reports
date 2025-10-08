export function getSortByForRequest(countsDir, lastPlayedDir) {
  if (countsDir) {
    return countsDir === "desc" ? "playCountDecrease" : "playCountIncrease";
  }
  if (lastPlayedDir) {
    return lastPlayedDir === "desc" ? "lastPlayedDecrease" : "lastPlayedIncrease";
  }
  return "playCountDecrease";
}

export function createHeaderControls(countsDir, lastPlayedDir, onToggle) {
  return {
    "Played Total": {
      direction: countsDir,
      onToggle: () => onToggle("Played Total"),
    },
    "Last played": {
      direction: lastPlayedDir,
      onToggle: () => onToggle("Last played"),
    },
  };
}
