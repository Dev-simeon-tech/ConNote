import LengthIcon from "@/assets/Length.svg?react";
import TempIcon from "@/assets/temp.svg?react";
import WeightIcon from "@/assets/weight.svg?react";
import SpeedIcon from "@/assets/speed.svg?react";
import TimeIcon from "@/assets/time.svg?react";
import CurrencyIcon from "@/assets/currency.svg?react";
import AreaIcon from "@/assets/area.svg?react";

export const convertersData = [
  {
    name: "Length",
    description: "Convert between metric and imperial linear measurements",
    icon: LengthIcon,
    badge: "popular",
  },
  {
    name: "Currency",
    description: "Real-time exchange rates for global commerce.",
    icon: CurrencyIcon,
    badge: "Live",
  },
  {
    name: "Weight",
    description: "Mass conversion including Kilograms, Pounds, and Ounces.",
    icon: WeightIcon,
  },
  {
    name: "Temperature",
    description: "Quickly switch between Celsius, Fahrenheit, and Kelvin.",
    icon: TempIcon,
  },
  {
    name: "Area",
    description: "Surface area conversion for architectural and land plots.",
    icon: AreaIcon,
  },
  {
    name: "Time",
    description: "Convert time units from seconds to years and more.",
    icon: TimeIcon,
  },
  {
    name: "Speed",
    description: "Calculate velocity in km/h, mph, and nautical knots.",
    icon: SpeedIcon,
  },
];
