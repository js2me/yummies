import { typeGuard } from './type-guard/index.js';
import { Maybe } from './utils/types.js';

type ErrorToTextEnhancer = (error: any) => string;
type ErrorToTextFormatErrorFn = (error: Error) => string;

/**
 * Universal function for transforming any errors into readable error text
 *
 * This function can be enhanced with custom handlers using:
 * - `errorToText.unknownErrorText`
 * - `errorToText.formatError`
 * - `errorToText.enhance`
 */
export const errorToText = (error: unknown) => {
  if (!error) {
    return errorToText.unknownErrorText;
  }

  if (typeGuard.isString(error)) {
    return error;
  }

  if (error instanceof Error) {
    return errorToText.formatError?.(error) ?? error.message;
  }

  if (errorToText.enhance) {
    return errorToText.enhance(error);
  } else {
    return errorToText.unknownErrorText;
  }
};

errorToText.unknownErrorText = '';
errorToText.formatError = null as Maybe<ErrorToTextFormatErrorFn>;
errorToText.enhance = null as Maybe<ErrorToTextEnhancer>;
