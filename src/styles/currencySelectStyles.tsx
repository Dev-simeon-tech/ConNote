import { type StylesConfig } from "react-select";
import { type CurrencyOption } from "@/features/converters/currency";

const SELECT_PRIMARY_COLOR = "#006948";
const SELECT_BORDER_COLOR = "#e5e7eb";

export const currencySelectStyles: StylesConfig<CurrencyOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    width: "100%",
    borderColor: state.isFocused ? SELECT_PRIMARY_COLOR : "transparent",
    borderRadius: "0.75rem",
    backgroundColor: "white",
    boxShadow: state.isFocused ? `0 0 0 1px ${SELECT_PRIMARY_COLOR}` : "none",
    "&:hover": {
      borderColor: SELECT_PRIMARY_COLOR,
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 30,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? SELECT_BORDER_COLOR
      : state.isFocused
        ? SELECT_BORDER_COLOR
        : "white",
    color: "inherit",
    cursor: "pointer",
  }),
};
