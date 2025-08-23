import { useContext } from "react";
import { DropdownContext } from "../../context/dropdown.context";
import { useClickOutside } from "../../hooks/useClickOutside";

import arrowIcon from "../../assets/arrow-up.svg";

type DropdownProps<T> = {
  unitsArr: T[];
  unitValue: T;
  unitType?: string;
  setFromUnit: React.Dispatch<React.SetStateAction<T>>;
  setToUnit: React.Dispatch<React.SetStateAction<T>>;
};

const Dropdown = <T,>({
  unitsArr,
  unitValue,
  setFromUnit,
  setToUnit,
  unitType,
}: DropdownProps<T>) => {
  const {
    isDropdown1Open,
    isDropdown2Open,
    setIsDropdown2Open,
    setIsDropdown1Open,
  } = useContext(DropdownContext);

  useClickOutside(".unit-dropdown", () => {
    setIsDropdown1Open(false);
    setIsDropdown2Open(false);
  });

  const toggleDropdown1 = () => {
    setIsDropdown1Open(!isDropdown1Open);
    setIsDropdown2Open(false);
  };
  const toggleDropdown2 = () => {
    setIsDropdown2Open(!isDropdown2Open);
    setIsDropdown1Open(false);
  };

  const fromUnitChangeHandler = (unit: T) => {
    setFromUnit(unit);
    setIsDropdown1Open(false);
  };

  const toUnitChangeHandler = (unit: T) => {
    setToUnit(unit);
    setIsDropdown2Open(false);
  };
  const unitChangeHandler = (unit: T) => {
    if (unitType === "fromUnit") {
      fromUnitChangeHandler(unit);
    } else {
      toUnitChangeHandler(unit);
    }
  };
  const isOpen = unitType === "fromUnit" ? isDropdown1Open : isDropdown2Open;
  return (
    <>
      <button
        onClick={unitType === "fromUnit" ? toggleDropdown1 : toggleDropdown2}
        className='flex gap-2 items-center'
      >
        <p className='capitalize text-xl'>{String(unitValue)}</p>
        <img src={arrowIcon} alt='arrow icon' />
      </button>
      <div
        role='listbox'
        aria-expanded={isOpen}
        className={`flex bg-gray z-20 w-fit rounded-md gap-1 -top-1/2 -translate-y-1/2 transition-all flex-col absolute ${
          isOpen
            ? "max-h-[25rem] overflow-y-auto p-1"
            : "max-h-0 overflow-y-hidden"
        }`}
      >
        {unitsArr.map((unit, index) => (
          <button
            onClick={() => unitChangeHandler(unit)}
            className={`unit-option px-2 py-1 relative hover:bg-dark-gray rounded-md ${
              unitValue === unit ? "active bg-dark-gray" : ""
            }`}
            key={index}
          >
            <p className='capitalize text-left'>{String(unit)}</p>
          </button>
        ))}
      </div>
    </>
  );
};

export default Dropdown;
