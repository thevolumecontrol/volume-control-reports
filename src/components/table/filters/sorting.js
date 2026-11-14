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
    Spins: {
      direction: countsDir,
      onToggle: () => onToggle("Spins"),
    },
    Time: {
      direction: lastPlayedDir,
      onToggle: () => onToggle("Time"),
    },
    "Last played": {
      direction: lastPlayedDir,
      onToggle: () => onToggle("Last played"),
    },
  };
}
