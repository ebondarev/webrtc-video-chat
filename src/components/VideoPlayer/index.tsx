import React from 'react';

export interface IVideoPlayerProps {
  srcObject: HTMLVideoElement['srcObject'];
}

export const VideoPlayer: React.FC<IVideoPlayerProps> = ({ srcObject }) => {
  const videoElementRef = React.useRef< HTMLVideoElement >(null);

  React.useEffect(function initPlayer() {
    const videoElement = videoElementRef.current;
    if (videoElement === null) return;
    videoElement.srcObject = srcObject;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    }
  }, [ srcObject ]);

  return (
    <video ref={ videoElementRef } style={{ border: '2px solid red', width: '100%' }}></video>
  );
};
