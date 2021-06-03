import React from "react";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";

export interface IMicrophoneIconProps {
  isOn: boolean;
}

export const MicrophoneIcon: React.FC<IMicrophoneIconProps> = ({ isOn }) => {
  return (
    isOn
      ? <BiMicrophone />
      : <BiMicrophoneOff />
  );
};
