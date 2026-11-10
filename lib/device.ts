/** iPhone or iPad, including iPads that report themselves as a Mac. */
export function isIos(userAgent: string, maxTouchPoints = 0) {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true;
  return /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

/** True when Tend is opened from the home screen rather than the browser. */
export function isInstalled(
  matchesStandalone: boolean,
  navigatorStandalone?: boolean,
) {
  return matchesStandalone || navigatorStandalone === true;
}
