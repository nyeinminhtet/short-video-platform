import React, { ReactNode } from "react";
import { BiCommentX } from "react-icons/bi";

interface Props {
  text: string;
  icon?: ReactNode;
}

const NoResult = ({ text, icon }: Props) => {
  return (
    <div className=" flex flex-col justify-center w-[200px] h-[200px] m-auto items-center md:h-full md:w-full ">
      <p className="text-sm md:text-8xl">
        {text === "No comments yet" ? <BiCommentX /> : ""}
      </p>
      <div className=" text-xl md:text-8xl">{icon}</div>
      <p className=" text-xl md:text-2xl text-center">{text}</p>
    </div>
  );
};

export default NoResult;
