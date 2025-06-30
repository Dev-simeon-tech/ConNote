export const getDynamicFontSize = (length: number): string => {
  if (length < 12) return "4rem";
  if (length < 15) return "3.5rem";
  if (length < 18) return "2.7rem";
  if (length < 20) return "2.2rem";

  return "2rem";
};
export const getDynamicInputFontSize = (length: number): string => {
  if (length < 11) return "4rem";
  if (length < 13) return "3.7rem";
  if (length < 16) return "2.8rem";
  if (length < 19) return "2.5rem";

  return "2.2rem";
};
