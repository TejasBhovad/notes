import React from "react";

const Error = ({ message }) => {
  return (
    <div className="w-full h-full items-center flex justify-center flex-col">
      <h1 className="text-9xl font-bold text-primary/75">404</h1>
      <span className="text-md font-semibold text-textMuted">{message}</span>
    </div>
  );
};

export default Error;
