import React from "react";
import { AppContext } from "../../App";
import { IVideoPlayerProps, VideoPlayer } from "../VideoPlayer"
import s from './index.module.css';

export interface IParticipantsVideo extends IVideoPlayerProps {
  id: string;
};

export interface IParticipantsProps { }

export const Participants: React.FC<IParticipantsProps> = () => {
  const { remoteMediaConnects } = React.useContext(AppContext);

  const videos = React.useMemo(() => {
    return remoteMediaConnects.map((item) => {
      return {
        id: item.connect.peer,
        srcObject: item.stream,
      };
    });
  }, [ remoteMediaConnects ]);

  return (
    <ul className={ s['participants'] }>
      {videos.map((video) => {
        return (
          <li key={ video.id } className={ s['participants__item'] }>
            <VideoPlayer srcObject={ video.srcObject } />
          </li>
        );
      })}
    </ul>
  );
}

