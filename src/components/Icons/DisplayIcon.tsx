import React from "react";
import { BsDisplay } from "react-icons/bs";

export interface IDisplayIconProps {
  isOn: boolean;
}

export const DisplayIcon: React.FC<IDisplayIconProps> = ({ isOn }) => {
  return (
    isOn
      ? <BsDisplay />
      : <div>BsDisplay off</div>
  );
};
