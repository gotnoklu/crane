export function toMilliseconds(hours = 0, minutes = 0, seconds = 0) {
  const hoursAsMilliseconds = hours * (1000 * 60 * 60)
  const minutesAsMilliseconds = minutes * (1000 * 60)
  const secondsAsMilliseconds = seconds * 1000
  return hoursAsMilliseconds + minutesAsMilliseconds + secondsAsMilliseconds
}

export function fromMilliseconds(milliseconds: number) {
  return {
    hours: Math.floor(milliseconds / (1000 * 60 * 60)),
    minutes: Math.floor((milliseconds / (1000 * 60)) % 60),
    seconds: Math.floor((milliseconds / 1000) % 60),
    milliseconds: Math.floor((milliseconds % 1000) / 10),
  }
}
