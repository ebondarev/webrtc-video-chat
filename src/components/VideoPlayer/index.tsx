import React from 'react';
import videojs, { VideoJsPlayerOptions } from 'video.js';
import './video.js.css';

export interface IVideoPlayerProps extends VideoJsPlayerOptions {
  srcObject?: MediaStream;
}

export const VideoPlayer: React.FC<IVideoPlayerProps> = React.memo((props) => {
  const videoNode: React.MutableRefObject<HTMLVideoElement | null> = React.useRef(null);

  React.useEffect(() => {
    if (videoNode.current === null) {
      return;
    }

    const player = videojs(videoNode.current, props, function onPlayerReady() {
      console.log('onPlayerReady');
    });
    const videoElement = player.tech().el() as HTMLVideoElement;
    if (props.srcObject) {
      videoElement.srcObject = props.srcObject;
    }

    return () => {
      player.dispose();
    }
  }, [ props ]);

  return (
    <div data-vjs-player>
      <video ref={ videoNode } className="video-js"></video>
    </div>
  );
});
