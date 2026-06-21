/**
 * Executes a function within a view transition if supported by the browser.
 *
 * @param {VoidFunction} fn - The function to be executed.
 * @returns {ViewTransition} - The result of the executed function.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition | MDN: Document.startViewTransition}
 */
export const startViewTransitionSafety = (
  fn: VoidFunction,
  params?: { disabled?: boolean },
) => {
  if (
    typeof document !== 'undefined' &&
    document.startViewTransition &&
    !params?.disabled
  ) {
    return document.startViewTransition(fn);
  }
  fn();
};
