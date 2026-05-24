const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;

type Unit =
  | "Years"
  | "Year"
  | "Yrs"
  | "Yr"
  | "Y"
  | "Weeks"
  | "Week"
  | "W"
  | "Days"
  | "Day"
  | "D"
  | "Hours"
  | "Hour"
  | "Hrs"
  | "Hr"
  | "H"
  | "Minutes"
  | "Minute"
  | "Mins"
  | "Min"
  | "M"
  | "Seconds"
  | "Second"
  | "Secs"
  | "Sec"
  | "s"
  | "Milliseconds"
  | "Millisecond"
  | "Msecs"
  | "Msec"
  | "Ms";

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

export type StringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;

/**
 * Converts a time interval string to milliseconds.
 *
 * Supported time units (case-insensitive):
 * - `years`, `year`, `yrs`, `yr`, `y` – years (1 year = 365.25 days)
 * - `weeks`, `week`, `w` – weeks
 * - `days`, `day`, `d` – days
 * - `hours`, `hour`, `hrs`, `hr`, `h` – hours
 * - `minutes`, `minute`, `mins`, `min`, `m` – minutes
 * - `seconds`, `second`, `secs`, `sec`, `s` – seconds
 * - `milliseconds`, `millisecond`, `msecs`, `msec`, `ms` – milliseconds
 *
 * A space between the number and the unit is allowed.
 * Fractional numbers are supported (e.g., `"1.5h"`).
 *
 * @param str - Time interval string, e.g., `"10s"`, `"1 day"`, `"2.5 hours"`.
 *              String length must be between 1 and 100 characters.
 * @returns Milliseconds as a number. Returns `NaN` if the string format is invalid.
 * @throws {Error} If the string is empty or longer than 100 characters.
 * @throws {Error} If the unit is recognized by the regex but has no corresponding switch case (unlikely, but handled).
 *
 * @example
 * ms("1s");                     // 1000
 * ms("2 minutes");              // 120000
 * ms("1.5h");                   // 5400000
 * ms("10 days");                // 864000000
 * ms("1 year");                 // 31557600000 (365.25 days)
 * ms("invalid");                // NaN
 * ms("");                       // throws Error
 */
export function ms(str: StringValue): number {
  if (typeof str !== "string" || str.length === 0 || str.length > 100) {
    throw new Error(
      "Value provided to ms() must be a string with length between 1 and 99.",
    );
  }

  const match =
    /^(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str,
    );

  const groups = match?.groups as { value: string; type?: string } | undefined;
  if (!groups) {
    return NaN;
  }
  const n = parseFloat(groups.value);
  const type = (groups.type || "ms").toLowerCase() as Lowercase<Unit>;

  switch (type) {
    case "years":
    case "year":
    case "yrs":
    case "yr":
    case "y":
      return n * y;
    case "weeks":
    case "week":
    case "w":
      return n * w;
    case "days":
    case "day":
    case "d":
      return n * d;
    case "hours":
    case "hour":
    case "hrs":
    case "hr":
    case "h":
      return n * h;
    case "minutes":
    case "minute":
    case "mins":
    case "min":
    case "m":
      return n * m;
    case "seconds":
    case "second":
    case "secs":
    case "sec":
    case "s":
      return n * s;
    case "milliseconds":
    case "millisecond":
    case "msecs":
    case "msec":
    case "ms":
      return n;
    default:
      throw new Error(
        `Error! A unit of time ${type} has been recognized, but there is no corresponding case. Please check the input value`,
      );
  }
}
