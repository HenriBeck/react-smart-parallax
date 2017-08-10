/* eslint-disable no-console */

console.warn = (message) => {
  throw new Error(message);
};

console.error = (message) => {
  throw new Error(message);
};
