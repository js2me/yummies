# number()
Parses a number from raw input and optionally clamps, rounds or limits
fractional digits.

Strings are normalized by removing spaces and replacing `,` with `.` before
parsing. Invalid inputs return the configured fallback.
