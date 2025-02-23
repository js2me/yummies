/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Создает промис, который будет ждать указанное количество ms, чтобы выполниться
 *
 * @param ms значение в миллисекундах
 * @returns Promise
 */
export const sleep = (time: number = 0) => {
  const promise = Promise.resolve();

  setTimeout(() => {
    promise.then();
  }, time);

  return promise;
};

/**
 * Создает промис, который будет ждать указанное количество ms, чтобы выполниться
 *
 * @param ms значение в миллисекундах
 * @returns Promise
 */
export const waitAsync = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Создает вызов requestAnimationFrame, посылая туда фукнцию {quitFn}, если она возвращает true,
 * тогда повторно не будет создан вызов requestAnimationFrame, иначе будут создаваться повторно
 * вызовы requestAnimationFrame до тем пор, пока эта функция не вернёт true
 *
 * @param quitFn - сама фукнция которая исполнится в requestAnimationFrame
 * @param asMicrotask - дополнительно оборачивает RAF в queueMicrotask
 * @returns void
 */
export const endlessRAF = (
  quitFunction: () => boolean | void,
  asMicrotask?: boolean,
) => {
  if (quitFunction()) return;

  const raf = () =>
    requestAnimationFrame(() => endlessRAF(quitFunction, asMicrotask));

  if (asMicrotask) {
    queueMicrotask(raf);
  } else {
    raf();
  }
};
