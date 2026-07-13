export function cn(...inputs: (string | undefined | null | boolean | { [key: string]: boolean })[]) {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
