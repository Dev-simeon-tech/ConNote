import { useRef, useState, useEffect } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import ListComponent from "./listComponent";

import ArrowIcon from "../../assets/arrow-up.svg?react";

type DropdownProps<T> = {
  itemsArr: T[];
  currentItem: T;
  renderItem: (item: T, index: number) => React.ReactNode;
};

const Dropdown = <T,>({
  itemsArr,
  currentItem,
  renderItem,
}: DropdownProps<T>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [currentItem]);
  return (
    <div ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex gap-2 items-center'
      >
        <p className='capitalize text-xl'>{String(currentItem)}</p>
        <ArrowIcon width={"1.5rem"} height={"1.5rem"} />
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
        <ListComponent data={itemsArr} renderItem={renderItem} />
      </div>
    </div>
  );
};

export default Dropdown;
