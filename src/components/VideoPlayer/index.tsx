import React from 'react';
// import videojs, { VideoJsPlayerOptions } from 'video.js';
// import './video.js.css';

export interface IVideoPlayerProps extends HTMLVideoElement { }

export const VideoPlayer: React.FC<IVideoPlayerProps> = React.memo((props) => {
  const videoNode: React.MutableRefObject<HTMLVideoElement | null> = React.useRef(null);

  React.useEffect(() => {
    const videoElement = videoNode.current;

    if (videoElement === null) {
      return;
    }

    videoElement.srcObject = props.srcObject;
  }, [ props ]);

  return (
    <video ref={ videoNode }></video>
  );
});
