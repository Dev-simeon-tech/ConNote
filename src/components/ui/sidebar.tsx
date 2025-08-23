import { useContext } from "react";
import { NavLink, Outlet, Link } from "react-router";
import { SidebarContext } from "../../context/sidebar.context";
import { useClickOutside } from "../../hooks/useClickOutside";

import lengthIcon from "../../assets/length.png";
import weightIcon from "../../assets/weight-scale.png";
import temoeratureIcon from "../../assets/celsius.png";
import areaIcon from "../../assets/area.png";
import timeIcon from "../../assets/clock.png";
import speedIcon from "../../assets/speedometer.png";
import documentIcon from "../../assets/document.png";
import currencyIcon from "../../assets/currency.png";
import logo from "../../assets/logo.svg";

const Sidebar = () => {
  const { isNavOpen, setIsNavOpen } = useContext(SidebarContext);

  useClickOutside("#side-navigation", () => {
    setIsNavOpen(false);
  });

  return (
    <>
      <nav
        id='sidebar-navigation'
        className={`fixed z-25 bg-gray top-0 w-[75%] lg:w-auto p-1 overflow-y-auto  h-full ${
          isNavOpen ? "left-0" : "-left-[120%]"
        } transition-all duration-150 ease-in-out `}
      >
        <Link className='ml-15 pt-4 block' to='/'>
          <img src={logo} alt='ConNote logo' />
        </Link>
        <ul className='mt-10 flex flex-col gap-1'>
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
              <img src={speedIcon} alt='speed icon' />
              <p>Speed</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/currency' className='nav-link'>
              <img className='w-9' src={currencyIcon} alt='currency icon' />
              <p>currency</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/summarizer' className='nav-link'>
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
