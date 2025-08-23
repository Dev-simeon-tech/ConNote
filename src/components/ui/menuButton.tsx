import { useContext } from "react";
import { SidebarContext } from "../../context/sidebar.context";

const MenuButton = () => {
  const { toggleSidebar, animateMenu, isNavOpen } = useContext(SidebarContext);
  return (
    <button
      className=' w-8 h-8 z-40   flex flex-col gap-1 items-center justify-center '
      onClick={toggleSidebar}
      aria-controls='sidebar-navigation'
      aria-expanded={isNavOpen}
    >
      <span className='sr-only'>Toggle sidebar navigation</span>

      {[0, 1, 2].map((__, index) => (
        <div
          key={index}
          className={`bg-black transition-all rounded-2xl duration-150  h-0.75 ${
            animateMenu ? "w-3" : "w-6"
          }`}
        ></div>
      ))}
    </button>
  );
};

export default MenuButton;
