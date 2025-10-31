import { createAtom, type IAtom } from 'mobx';
import type { AnyObject } from 'yummies/types';

export interface IEnhancedAtom<TMeta extends AnyObject = AnyObject>
  extends IAtom {
  meta: TMeta;
}

/**
 * Creates an enhanced atom with meta data
 * And bind `reportChanged` and `reportObserved` method to the atom
 */
export const createEnhancedAtom = <TMeta extends AnyObject>(
  name: string,
  onBecomeObservedHandler?: (atom: IEnhancedAtom<TMeta>) => void,
  onBecomeUnobservedHandler?: (atom: IEnhancedAtom<TMeta>) => void,
  meta?: TMeta,
): IEnhancedAtom<TMeta> => {
  const atom = createAtom(
    name,
    onBecomeObservedHandler && (() => onBecomeObservedHandler(atom)),
    onBecomeUnobservedHandler && (() => onBecomeUnobservedHandler(atom)),
  ) as IEnhancedAtom<TMeta>;
  atom.meta = meta ?? ({} as TMeta);
  atom.reportChanged = atom.reportChanged.bind(atom);
  atom.reportObserved = atom.reportObserved.bind(atom);
  return atom;
};
