const GRID_SIZE = 1000;
const TOTAL = GRID_SIZE * GRID_SIZE;

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function memoryNumberToPosition(memoryNumber) {
  const index = Math.max(0, Math.min(TOTAL - 1, memoryNumber - 1));
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  return {
    row,
    col,
    x: (col + 0.5) / GRID_SIZE,
    y: (row + 0.5) / GRID_SIZE,
  };
}

export function prototypePlacement({ name, year, fileName }) {
  const seed = hashString(`${name}|${year}|${fileName}`);
  const memoryNumber = (seed % TOTAL) + 1;
  return { memoryNumber, ...memoryNumberToPosition(memoryNumber) };
}

export function formatMemoryNumber(value) {
  return new Intl.NumberFormat("en-US", { minimumIntegerDigits: 6, useGrouping: false }).format(value);
}

export { GRID_SIZE, TOTAL };
