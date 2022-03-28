export const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export function randomDelay() {
  return delay(Math.random() * 2 * 1000);
}
