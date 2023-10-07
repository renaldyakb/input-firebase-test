import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <BeatLoader color='#5a2835' />
    </div>
  );
};

export default Loading;
