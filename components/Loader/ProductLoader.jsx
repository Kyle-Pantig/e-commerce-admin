import React from "react";
import { PulseLoader } from "react-spinners";

const ProductLoader = () => {
  return (
    <div className="flex items-center justify-center my-5">
      <PulseLoader color="#000" speedMultiplier={0.5} size={10} />
    </div>
  );
};

export default ProductLoader;
