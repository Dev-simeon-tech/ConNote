export const getDynamicFontSize = (
  length: number,
  isMobile: boolean | undefined,
): string => {
  if (isMobile) return "1rem";
  if (length < 12) return "2.4rem";
  if (length < 17) return "2.1rem";
  if (length < 20) return "1.7rem";
  if (length < 25) return "1.5rem";
  if (length < 35) return "1.4rem";
  if (length < 40) return "1.2rem";
  return "1rem";
};
export const getDynamicInputFontSize = (
  length: number,
  isMobile: boolean | undefined,
): string => {
  if (isMobile) return "1rem";
  if (length < 11) return "1.2rem";
  if (length < 15) return "1.1rem";
  if (length < 19) return "1rem";

  return "1rem";
};
