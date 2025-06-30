import { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import { SidebarContext } from "../../context/sidebar.context";
import { useClickOutside } from "../../hooks/useClickOutside";

import lengthIcon from "../../assets/length.svg";
import weightIcon from "../../assets/weight-scale.svg";
import temoeratureIcon from "../../assets/celsius.svg";
import areaIcon from "../../assets/area.svg";
import timeIcon from "../../assets/clock.svg";
import speedIcon from "../../assets/speedometer.svg";
import documentIcon from "../../assets/document.svg";

const Sidebar = () => {
  const { isNavOpen, setIsNavOpen } = useContext(SidebarContext);

  useClickOutside("#side-navigation", () => {
    setIsNavOpen(false);
  });

  return (
    <>
      <nav
        id='sidebar-navigation'
        className={`fixed z-25 bg-gray top-0  p-1 overflow-y-auto  h-full ${
          isNavOpen ? "left-0" : "-left-[120%]"
        } transition-all duration-150 ease-in-out `}
      >
        <ul className='mt-20 flex flex-col gap-1'>
          <li>
            <NavLink to='/tools/length' className='nav-link'>
              <img src={lengthIcon} alt='length icon' />
              <p>Length</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/weight' className='nav-link'>
              <img src={weightIcon} alt='weight icon' />
              <p>Weight and mass</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/temperature' className='nav-link'>
              <img src={temoeratureIcon} alt='temperture icon' />
              <p>Temperature</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/area' className='nav-link'>
              <img src={areaIcon} alt='area icon' />
              <p>Area</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/time' className='nav-link'>
              <img src={timeIcon} alt='time icon' />
              <p>Time</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/speed' className='nav-link'>
              <img src={speedIcon} alt='area icon' />
              <p>Speed</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/pdfSummerizer' className='nav-link'>
              <img src={documentIcon} alt='document icon' />
              <p>PDF & PowerPoint summarizer</p>
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Sidebar;
