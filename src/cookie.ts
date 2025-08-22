import type { AnyObject } from './utils/types.js';

export const parseCookie = (cookiesString = document.cookie) => {
  return cookiesString
    .split(';')
    .map((cookieString) => cookieString.trim().split('='))
    .reduce<AnyObject>((acc, current) => {
      acc[current[0]] = current[1];
      return acc;
    }, {});
};
