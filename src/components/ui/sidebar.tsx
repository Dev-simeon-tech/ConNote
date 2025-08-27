import { useContext, useRef } from "react";
import { NavLink, Outlet, Link } from "react-router";
import { SidebarContext } from "../../context/sidebar.context";
import { useClickOutside } from "../../hooks/useClickOutside";

import LengthIcon from "../../assets/length.svg?react";
import WeightIcon from "../../assets/weight-scale.svg?react";
import TemperatureIcon from "../../assets/celsius.svg?react";
import AreaIcon from "../../assets/area.svg?react";
import TimeIcon from "../../assets/clock.svg?react";
import SpeedIcon from "../../assets/speedometer.svg?react";
import DocumentIcon from "../../assets/document.svg?react";
import CurrencyIcon from "../../assets/currency.svg?react";
import Logo from "../../assets/logo.svg?react";

const Sidebar = () => {
  const { isNavOpen, setIsNavOpen } = useContext(SidebarContext);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useClickOutside(sidebarRef, () => {
    setIsNavOpen(false);
  });

  return (
    <>
      <nav
        ref={sidebarRef}
        id='sidebar-navigation'
        className={`fixed z-25 bg-gray top-0 w-[75%] lg:w-auto p-1 overflow-y-auto  h-full ${
          isNavOpen ? "left-0" : "-left-[120%]"
        } transition-all duration-150 ease-in-out `}
      >
        <Link className='ml-15 block' to='/'>
          <Logo width={"7rem"} height={"4rem"} />
        </Link>
        <ul
          onClick={() => setIsNavOpen(!isNavOpen)}
          className='mt-5 flex flex-col gap-1'
        >
          <li>
            <NavLink to='/tools/length' className='nav-link'>
              <LengthIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Length</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/weight' className='nav-link'>
              <WeightIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Weight and mass</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/temperature' className='nav-link'>
              <TemperatureIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Temperature</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/area' className='nav-link'>
              <AreaIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Area</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/time' className='nav-link'>
              <TimeIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Time</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/speed' className='nav-link'>
              <SpeedIcon width={"2.25rem"} height={"2.25rem"} />
              <p>Speed</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/currency' className='nav-link'>
              <CurrencyIcon width={"2.25rem"} height={"2.25rem"} />
              <p>currency</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/tools/summarizer' className='nav-link'>
              <DocumentIcon width={"2.25rem"} height={"2.25rem"} />
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
