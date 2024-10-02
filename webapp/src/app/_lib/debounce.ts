// @ts-nocheck
export function debounce(func: any, wait: number) {
  let timeout;
  return function (...args) {
    const context = this;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
    if (!timeout) func.apply(context, args);
  };
}
