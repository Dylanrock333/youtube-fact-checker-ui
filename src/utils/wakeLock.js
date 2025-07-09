// A simple wrapper for the Screen Wake Lock API.

let wakeLock = null;

// Function to request the screen wake lock
export const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Screen Wake Lock is active.');

      // Listen for the lock being released, for example, if the user switches tabs
      wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock was released.');
      });

    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  } else {
    console.warn('Screen Wake Lock API not supported.');
  }
};

// Function to release the screen wake lock
export const releaseWakeLock = async () => {
  if (wakeLock !== null) {
    try {
      await wakeLock.release();
      wakeLock = null;
      // The event listener will log the release, so we don't need to log here.
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }
};

// Function to handle re-acquiring the lock when the page becomes visible again
const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    // If there was a lock before and the page is visible again, re-request it.
    // This is necessary because the browser automatically releases the lock when the tab is hidden.
    await requestWakeLock();
  }
};

// Listen for visibility changes to automatically re-acquire the lock
document.addEventListener('visibilitychange', handleVisibilityChange); 