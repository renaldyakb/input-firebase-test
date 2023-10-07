import React, { Children } from "react";
import Navbar from "../src/components/navbar";
import { Outlet } from "react-router-dom";

const Layouts = () => {
  return (
    <>
      <Navbar />

      <div className='content'>
        <Outlet />
      </div>
    </>
  );
};

export default Layouts;
