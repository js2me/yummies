import { createAtom, type IAtom } from 'mobx';
import type { AnyObject } from 'yummies/types';

export interface IEnhancedAtom<TMeta extends AnyObject = AnyObject>
  extends IAtom {
  meta: TMeta;
}

/**
 * Creates a MobX atom extended with metadata and bound reporting methods.
 *
 * @template TMeta Metadata object stored on the atom.
 * @param name Atom name used by MobX for debugging.
 * @param onBecomeObservedHandler Callback fired when the atom becomes observed.
 * @param onBecomeUnobservedHandler Callback fired when the atom is no longer observed.
 * @param meta Optional metadata attached to the atom.
 * @returns Atom instance with `meta`, `reportChanged` and `reportObserved`.
 *
 * @example
 * ```ts
 * const atom = createEnhancedAtom('user-status');
 * atom.reportChanged();
 * ```
 *
 * @example
 * ```ts
 * const atom = createEnhancedAtom('cache', undefined, undefined, { scope: 'users' });
 * atom.meta.scope;
 * ```
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
