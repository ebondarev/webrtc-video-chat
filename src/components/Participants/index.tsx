import React from "react";
import { IVideoPlayerProps, VideoPlayer } from "../VideoPlayer"
import s from './index.module.css';

export interface IParticipantsProps {
  videos: (IVideoPlayerProps & { id: number; })[];
}

export const Participants: React.FC<IParticipantsProps> = ({ videos }) => {
  return (
    <ul className={ s['participants'] }>
      {videos.map((video) => {
        return (
          <li key={ video.id } className={ s['participants__item'] }>
            <VideoPlayer { ...video } />
          </li>
        );
      })}
    </ul>
  );
}

