/**
 * Prevents the default browser action and stops event propagation.
 *
 * @example
 * ```ts
 * button.addEventListener('click', (event) => skipEvent(event));
 * ```
 */
export const skipEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();

  return false;
};
