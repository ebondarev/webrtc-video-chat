import React from "react";
import { AppContext } from "../../App";
import { IVideoPlayerProps, VideoPlayer } from "../VideoPlayer"
import s from './index.module.css';

export interface IParticipantsVideo extends IVideoPlayerProps {
  id: string;
};

export interface IParticipantsProps { }

export const Participants: React.FC<IParticipantsProps> = () => {
  const { remoteMediaConnects, localStream } = React.useContext(AppContext);

  const videos = React.useMemo(() => {
    const _videos = [];
    if (localStream) {
      _videos.push({
        id: localStream.id,
        srcObject: localStream,
      });
    }
    remoteMediaConnects.forEach((item) => {
      _videos.push({
        id: item.connect.peer,
        srcObject: item.stream,
      });
    });
    return _videos;
  }, [ remoteMediaConnects, localStream ]);

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

