import { typeGuard } from 'yummies/type-guard';
import type { Maybe } from 'yummies/types';

type GetErrorTextEnhancer = (error: any) => string;
type GetErrorTextFormatErrorFn = (error: Error) => string;

/**
 * Universal function for transforming any errors into readable error text
 *
 * This function can be enhanced with custom handlers using:
 * - `getErrorText.unknownErrorText`
 * - `getErrorText.formatError`
 * - `getErrorText.enhance`
 */
export const getErrorText = (error: unknown) => {
  if (!error) {
    return getErrorText.unknownErrorText;
  }

  if (typeGuard.isString(error)) {
    return error || getErrorText.unknownErrorText;
  }

  if (error instanceof Error) {
    return (
      (getErrorText.formatError?.(error) ?? error.message) ||
      getErrorText.unknownErrorText
    );
  }

  if (getErrorText.enhance) {
    return getErrorText.enhance(error) ?? getErrorText.unknownErrorText;
  } else {
    return getErrorText.unknownErrorText;
  }
};

getErrorText.unknownErrorText = '';
getErrorText.formatError = null as Maybe<GetErrorTextFormatErrorFn>;
getErrorText.enhance = null as Maybe<GetErrorTextEnhancer>;
