import React from "react";

const Logo = ({ variant }) => {
  return (
    <>
      {(!variant || variant === "default") && (
        <p className="text-sm lg:text-3xl pt-5">
          Dil<span className="text-red-500  text-2xl lg:text-6xl">Se</span>Link
        </p>
      )}
      {variant === "large" && (
        <p className="hidden lg:block lg:w-2/3 text-6xl">
          Dil <span className="text-red-500 text-9xl">Se</span>Link
        </p>
      )}
      {variant === "small" && (
        <p className="lg:hidden w-[20px] text-4xl">
          Dil <span className="text-red-500 text-6xl">Se</span>Link
        </p>
      )}
    </>
  );
};

export default Logo;
