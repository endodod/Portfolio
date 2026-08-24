// Pads names to the longest one in the list so the trailing values line up in a column.
export function alignList(items, valueFn) {
  const maxLen = Math.max(...items.map((item) => item.name.length));
  return items.map((item) => `${item.name.padEnd(maxLen)}  ${valueFn(item)}`);
}
