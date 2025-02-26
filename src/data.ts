import { isEqual } from 'lodash-es';

import { AnyObject } from './utils/types.js';

export const isShallowEqual = (a: unknown, b: unknown) => {
  if (a === b) {
    return true;
  }

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return (
    isEqual(aKeys, bKeys) &&
    aKeys.every((key) => (a as AnyObject)[key] === (b as AnyObject)[key])
  );
};
