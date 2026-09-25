import {hasClientId} from './client-id.js';

const TIME_KEY = '__typhoon_first_visit_time';
const URL_KEY = '__typhoon_first_visit_url';

export interface FirstVisit {
  time: string;
  url: string;
}

/** Stores a new visitor's first visit time and URL, keeping any earlier record. */
export function recordFirstVisit(): void {
  try {
    if (hasClientId() || window.localStorage.getItem(TIME_KEY) !== null) {
      return;
    }
    window.localStorage.setItem(TIME_KEY, new Date().toISOString());
    window.localStorage.setItem(URL_KEY, window.location.href);
  } catch {
    // Do nothing
  }
}

/** Reads and clears the stored first visit, if any. */
export function takeFirstVisit(): FirstVisit | undefined {
  try {
    const time = window.localStorage.getItem(TIME_KEY);
    const url = window.localStorage.getItem(URL_KEY);
    window.localStorage.removeItem(TIME_KEY);
    window.localStorage.removeItem(URL_KEY);
    return time && url ? {time, url} : undefined;
  } catch {
    return undefined;
  }
}
