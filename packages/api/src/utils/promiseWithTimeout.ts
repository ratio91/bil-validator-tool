// based on https://spin.atomicobject.com/2020/01/16/timeout-promises-nodejs/

/**
 * Executes a promise and/or timeouts with an error in case the specified time is exceeded.
 */
const promiseWithTimeout = <T>(timeoutMs: number, asyncFunction: () => Promise<T>, failureMessage?: string) => {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(failureMessage)), timeoutMs);
  });

  return Promise.race([asyncFunction(), timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};
export default promiseWithTimeout;
