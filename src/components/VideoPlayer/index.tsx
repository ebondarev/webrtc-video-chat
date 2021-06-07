import React from 'react';

export interface IVideoPlayerProps extends HTMLVideoElement { }

export const VideoPlayer: React.FC<IVideoPlayerProps> = (props) => {
  console.log('%c props ', 'background: #222; color: #bada55', props);
  const { srcObject } = props;

  const videoNode: React.MutableRefObject<HTMLVideoElement | null> = React.useRef(null);

  React.useEffect(function initPlayer() {
    const videoElement = videoNode.current;

    if (videoElement === null) {
      return;
    }

    videoElement.srcObject = srcObject;
  }, [ srcObject ]);

  return (
    <video ref={ videoNode } style={{ border: '2px solid red' }}></video>
  );
};
