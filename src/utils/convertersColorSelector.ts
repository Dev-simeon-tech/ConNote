export const converterColorSelector = (value: string) => {
  switch (value) {
    case "length":
      return "#3b82f6";

    case "weight":
      return "#7c3aed";

    case "temperature":
      return "#ea580c";

    case "area":
      return "#0d9488";

    case "speed":
      return "#ca8a04";

    case "time":
      return "#db2777";

    case "currency":
      return "#db277";
  }
};
