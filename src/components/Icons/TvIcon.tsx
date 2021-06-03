import React from "react";
import { BiTv } from "react-icons/bi";

export interface ITvIconProps {
  isOn: boolean;
}

export const TvIcon: React.FC<ITvIconProps> = ({ isOn }) => {
  return (
    isOn
      ? <BiTv />
      : <div>BiTv off</div>
  );
};
