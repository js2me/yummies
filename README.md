<img src="assets/logo.png" align="right" width="176" alt="logo" />

# yummies  

[![NPM version][npm-image]][npm-url] [![build status][github-build-actions-image]][github-actions-url] [![npm download][download-image]][download-url] [![bundle size][bundlephobia-image]][bundlephobia-url]


[npm-image]: http://img.shields.io/npm/v/yummies.svg
[npm-url]: http://npmjs.org/package/yummies
[github-build-actions-image]: https://github.com/js2me/yummies/workflows/Build/badge.svg
[github-actions-url]: https://github.com/js2me/yummies/actions
[download-image]: https://img.shields.io/npm/dm/yummies.svg
[download-url]: https://npmjs.org/package/yummies
[bundlephobia-url]: https://bundlephobia.com/result?p=yummies
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/yummies


Yummies - a set of various utilities for JavaScript projects with open source code, designed to simplify the execution of common tasks and increase performance. This project provides developers with powerful and easy-to-use functions that can be easily integrated into any JavaScript code.

## [yummies/async](src/async.ts)  
Utilities for working with asynchronous code  

## [yummies/common](src/common.ts)  
All other utilities without groupping  

## [yummies/cookie](src/cookie.ts)  
Utilities for working with cookies  

## [yummies/css](src/css.ts)  
Utilities for working with CSS  

## [yummies/date-time](src/date-time.ts)  
Utilities for working with dates and times (based on dayjs)  

## [yummies/device](src/device.ts)  
Utilities for working with devices  

## [yummies/html](src/html.ts)  
Utilities for working with HTML  

## [yummies/id](src/id.ts)  
Utilities for working with identifiers  

## [yummies/imports](src/imports.ts)  
Utilities for working with module imports  

## [yummies/math](src/math.ts)  
Utilities for working with devices  

## [yummies/media](src/media.ts)  
Utilities for working with media (image, canvas and blob)  

## [yummies/ms](src/ms.ts)  
Utilities for working with milliseconds  

## [yummies/price](src/price.ts)  
Utilities for working with monetary values (formatting)  

## [yummies/sound](src/sound.ts)  
Utilities for working with sound  

## [yummies/storage](src/storage.ts)  
Utilities for working with storage (localStorage, sessionStorage)  

## [yummies/text](src/text.ts)  
Utilities for working with text  

## [yummies/type-guard](src/type-guard.ts)  
Utility for type checks  

## [yummies/vibrate](src/vibrate.ts)  
Utilities for working with vibrate api  

## [yummies/utility-types](src/utils/types.ts)  
TypeScript utility types that simplify writing TypeScript code.  
They can be imported globally using the `d.ts` file, embedding it in the environment  
```ts
import 'yummies/utility-types';
```  
Or specified in `tsconfig.json` in the `"types"` field    
```json
{
  "compilerOptions": {
    "types": [
      "yummies/utility-types"
    ],
    "target": "...blabla",
    ...
  }
  ...
}
```
Alternatively, you can use the "library" approach, where you need exported types.  
For this, you can use the `yummies` or `yummies/utils/types` import.

```ts
import { AnyObject } from 'yummies';
```


## [yummies/complex](src/complex/index.ts)  

Additional set of complex utilities  
