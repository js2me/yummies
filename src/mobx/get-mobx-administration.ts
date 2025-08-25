import {
  $mobx,
  type ObservableObjectAdministration,
} from 'mobx/dist/internal.js';
import type { AnyObject } from '../utils/types.js';

export const getMobxAdministration = (
  context: AnyObject,
): ObservableObjectAdministration => context[$mobx];
