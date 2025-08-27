import DeleteIcon from "../../assets/delete.svg?react";
import MinusPlusIcon from "../../assets/minus-plus.svg?react";
type KeypadProps = {
  setInput: React.Dispatch<React.SetStateAction<string>>;
  input: string;
  keypadtype?: string;
};

const Keypad = ({ setInput, input, keypadtype }: KeypadProps) => {
  const handleClick = (val: string) => {
    if (val === "C") return setInput("0");
    if (val === "-/+")
      return setInput((prev) =>
        prev.startsWith("-") ? prev.slice(1) : "-" + prev
      );
    if (val === "←") {
      if (input.startsWith("-")) {
        return setInput((prev) =>
          prev.length <= 2 ? prev.slice(1) : prev.slice(0, -1)
        );
      } else {
        return setInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      }
    }

    if (input.length >= 15) return;
    if (val === "." && input.includes(".")) return; // Prevent multiple dots

    setInput((prev) => (prev === "0" && val !== "." ? val : prev + val));
  };

  return (
    <div className='keypad lg:h-[80%]  grid grid-cols-3 gap-1 p-2'>
      <button
        className='col-start-2 bg-transparent border-1 border-light-green'
        onClick={() => handleClick("C")}
      >
        CE
      </button>
      <button onClick={() => handleClick("←")}>
        <DeleteIcon width={"3rem"} height={"3rem"} />
      </button>
      {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."].map((val) => (
        <button
          key={val}
          onClick={() => handleClick(val)}
          className={`keypad-button ${val === "0" ? "col-start-2" : ""}`}
        >
          {val}
        </button>
      ))}
      {keypadtype && (
        <button className='row-start-5' onClick={() => handleClick("-/+")}>
          <MinusPlusIcon width={"2.5rem"} height={"2.5rem"} />
        </button>
      )}
    </div>
  );
};

export default Keypad;
