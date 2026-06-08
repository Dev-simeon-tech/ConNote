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
    <div ref={dropdownRef} className='relative inline-block'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex gap-2 items-center shadow-lg  bg-white px-4 py-2 rounded-md'
      >
        <p className='capitalize text-[14px] font-semibold'>
          {String(currentItem)}
        </p>
        <ArrowIcon width={"1.5rem"} height={"1.5rem"} />
      </button>
      <div
        role='listbox'
        aria-expanded={isOpen}
        className={`absolute left-0 top-full max-h-100 divide-y-1 text-[14px] min-w-50  mt-2 z-20 w-full rounded-md gap-1 flex flex-col transition-transform  ${
          isOpen
            ? "scale-100 p-1 bg-white shadow-lg overflow-y-auto "
            : "scale-0  overflow-y-hidden "
        }`}
      >
        <ListComponent data={itemsArr} renderItem={renderItem} />
      </div>
    </div>
  );
};

export default Dropdown;
