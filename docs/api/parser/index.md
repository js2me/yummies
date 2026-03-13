# parser

### parser.NumberParserSettings
_No description._


### parser.number()
Parses a number from raw input and optionally clamps, rounds or limits
fractional digits.

Strings are normalized by removing spaces and replacing `,` with `.` before
parsing. Invalid inputs return the configured fallback.


### parser.percent()
Converts a value into a percentage of `maxValue` and parses the result with
the shared numeric parser.


### parser.StringParserSettings
_No description._


### parser.string()
Converts arbitrary input into a string representation.

Objects are serialized with `JSON.stringify`, optionally pretty-printed, and
nullish values resolve to the configured fallback.

