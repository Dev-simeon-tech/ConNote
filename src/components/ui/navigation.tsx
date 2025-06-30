import { useState } from "react";
import { NavLink } from "react-router";

import logo from "../../assets/logo.svg";
const Navigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  return (
    <>
      {/* <section className='h-10 '></section> */}
      <header
        className={`flex justify-between items-center lg:backdrop-blur-sm left-0 top-0 bg-white lg:bg-[hsla(0,0%,91%,26%)] lg:shadow-none p-4 lg:py-6 lg:px-10 fixed w-full  shadow-md $`}
      >
        <a href='/'>
          <img src={logo} alt='ConNote logo' />
        </a>
        <nav
          id='primary-navigation'
          className={` fixed h-full   lg:py-3 lg:px-2  lg:border-2 lg:border-black lg:rounded-4xl backdrop-blur-sm  inset-0 w-full items-center transition-opacity justify-center lg:block lg:relative lg:opacity-100 lg:w-fit lg:bg-transparent  bg-dark-overlay ${
            isNavOpen ? "opacity-100 flex" : "hidden opacity-0 "
          } `}
        >
          <ul className='flex lg:flex-row flex-col  gap-8 lg:gap-16 text-4xl lg:text-xl text-center text-white lg:text-black'>
            <li>
              <NavLink className='nav-link' to='/'>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className='nav-link' to='/tools'>
                Tools
              </NavLink>
            </li>
            <li>
              <NavLink className='nav-link' to='/about'>
                About
              </NavLink>
            </li>
          </ul>
        </nav>
        <button
          className='z-20 lg:hidden'
          onClick={toggleNav}
          aria-controls='primary-navigation'
          aria-expanded={isNavOpen}
        >
          <span className='sr-only'>Toggle navigation</span>

          {isNavOpen ? (
            <svg
              width='29'
              height='29'
              viewBox='0 0 29 29'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20.5415 8.45837L8.45817 20.5417'
                stroke='#fff'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
              <path
                d='M8.4585 8.45837L20.5418 20.5417'
                stroke='#fff'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          ) : (
            <svg
              width='21'
              height='14'
              viewBox='0 0 21 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M20 1H1M20 7H1M20 13H1'
                stroke='#292929'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          )}
        </button>
      </header>
    </>
  );
};

export default Navigation;
