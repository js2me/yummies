import { sleep } from './sleep.js';

/**
 * Creates a promise that resolves after the specified number of milliseconds.
 *
 * @deprecated Use `sleep` instead.
 * @param ms Delay in milliseconds.
 * @returns Promise
 */
export const waitAsync = (ms = 1000) => sleep(ms);
