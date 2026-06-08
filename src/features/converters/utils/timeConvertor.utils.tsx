export type timeType =
  | "Microseconds"
  | "Milliseconds"
  | "Seconds"
  | "Minutes"
  | "Hours"
  | "Days"
  | "Weeks"
  | "Years";

const toSeconds: Record<timeType, number> = {
  Microseconds: 1e-6,
  Milliseconds: 0.001,
  Seconds: 1,
  Minutes: 60,
  Hours: 3600,
  Days: 86400,
  Weeks: 604800,
  Years: 31536000,
};

export const convertTime = (
  value: number,
  from: timeType,
  to: timeType
): number => {
  const inSeconds = value * toSeconds[from];
  return inSeconds / toSeconds[to];
};
