export function formatXMBClock(d: Date = new Date()): string {
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = `${d.getMonth() + 1}/${d.getDate()}`;
  return `${date}  ${time}`;
}
