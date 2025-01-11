import React from "react";
import { CiForkAndKnife } from "react-icons/ci";
const FilterProduct = (category) => {
  return (
    <>
    <div >
      <div className="text-3xl p-3 bg-yellow-500 rounded-full">
        <CiForkAndKnife />
      </div>
    <p className="text-center font-medium my-1 capitalize">{category}</p>
    </div>
    </>
  );
};

export default FilterProduct;
