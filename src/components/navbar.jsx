import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className='flex fixed w-full bg-sky-100 shadow-xl h-10 items-center justify-between px-10'>
        <Link to='/'>
          <h1 className='font-bold'>LEMANG.co</h1>
        </Link>
        <div className='flex list-none space-x-6'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/blog'>Blog</Link>
          </li>
          <li>
            <Link to='/data'>Data</Link>
          </li>
          <li>
            <Link to='/dashboard'>Dashboard</Link>
          </li>
        </div>
      </div>
    </>
  );
};

export default Navbar;
