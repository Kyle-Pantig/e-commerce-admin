import React from "react";
import { FadeLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center ">
      <FadeLoader color="#000" speedMultiplier={2} className="ml-2" />
    </div>
  );
};

export default Spinner;
