import React from "react";
import { IoVideocamOutline, IoVideocamOffOutline } from "react-icons/io5";

export interface IVideoCameraIconProps {
  isOn: boolean;
}

export const VideoCameraIcon: React.FC<IVideoCameraIconProps> = ({ isOn }) => {
  return (
    isOn
      ? <IoVideocamOutline />
      : <IoVideocamOffOutline />
  );
};
