const colors = [
  "#03b068",
  "#f7b924",
  "#8744f2",
  "#f24444",
  "#527615",
  "#f244f2",
  "#abbe65",
  "#1363b7",
  "#a5b51c",
  "#0c40da",
  "#f2a244",
  "#f244c5",
  "#240602",
  "#311000",
  "#f244f2",
];

export function getChartColor(index?: number): string {
  if (index === undefined || index > colors.length - 1) {
    return getRandomColor();
  }
  return colors[index];
}

function getRandomColor(): string {
  // no dark colors
  const letters = "89ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
