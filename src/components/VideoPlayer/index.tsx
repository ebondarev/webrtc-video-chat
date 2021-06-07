import React from 'react';

export interface IVideoPlayerProps extends HTMLVideoElement { }

export const VideoPlayer: React.FC<IVideoPlayerProps> = (props) => {
  const { srcObject } = props;

  const videoNode: React.MutableRefObject<HTMLVideoElement | null> = React.useRef(null);

  React.useEffect(function initPlayer() {
    const videoElement = videoNode.current;
    if (videoElement === null) {
      return;
    }
    videoElement.srcObject = srcObject;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
  }, [ srcObject ]);

  return (
    <video ref={ videoNode }></video>
  );
};
