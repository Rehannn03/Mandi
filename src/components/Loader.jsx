import { ClockLoader } from "react-spinners";
import {FadeLoader} from "react-spinners";
import React from "react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-800">
      <FadeLoader color="#000" height={30} />
    </div>
  );
};
