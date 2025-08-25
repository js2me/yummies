import { $mobx, type AnnotationMapEntry } from 'mobx';
import type { AnyObject } from '../utils/types.js';

type ObservableObjectAdministration = Parameters<
  Exclude<AnnotationMapEntry, boolean>['make_']
>[0];

export const getMobxAdministration = (
  context: AnyObject,
): ObservableObjectAdministration => context[$mobx];
