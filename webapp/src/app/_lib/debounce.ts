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

export async function delayBetween(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}
