import { useState, useContext } from "react";
import { signOutUser } from "../../lib/firebase/firebase";

import { UserContext } from "../../context/user.context";
import { NavLink, Link } from "react-router";
import Button from "./button";

import Logo from "../../assets/logo.svg?react";

const Navigation = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user } = useContext(UserContext);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  const signOutHandler = async () => {
    await signOutUser();
  };
  return (
    <>
      <header
        className={`flex justify-between items-center lg:backdrop-blur-sm left-0 top-0 bg-white lg:bg-[hsla(0,0%,91%,26%)] lg:shadow-none p-4 lg:py-6 lg:px-10 fixed w-full  shadow-md $`}
      >
        <Link to='/'>
          <Logo width={"8rem"} height={"4rem"} />
        </Link>
        <nav
          id='primary-navigation'
          className={` fixed h-full lg:flex justify-center gap-4 lg:gap-0 lg:flex-row flex-col backdrop-blur-sm w-full inset-0 lg:backdrop-blur-none items-center transition-opacity lg:w-[65%] lg:justify-between lg:relative lg:opacity-100  lg:bg-transparent  bg-dark-overlay ${
            isNavOpen ? "opacity-100 flex" : "hidden opacity-0 "
          } `}
        >
          <ul className='flex lg:flex-row lg:border-2 lg:rounded-4xl flex-col lg:py-3 lg:px-2 lg:border-black  gap-8 lg:gap-16 text-4xl lg:text-xl text-center text-white lg:text-black'>
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
          {user ? (
            <p
              onClick={signOutHandler}
              className='lg:text-xl text-3xl mt-10 lg:mt-0 cursor-pointer text-light-green lg:text-dark-green lg:hover:text-light-green'
            >
              Sign Out
            </p>
          ) : (
            <Link to='/sign-in'>
              <Button variant='primary'>Sign In</Button>
            </Link>
          )}
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
