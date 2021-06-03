import React from 'react';
import videojs, { VideoJsPlayerOptions } from 'video.js';
import './video.js.css';

export interface IVideoPlayerProps extends VideoJsPlayerOptions { }

export const VideoPlayer: React.FC<IVideoPlayerProps> = React.memo((props) => {
  const videoNode: React.MutableRefObject<HTMLVideoElement | null> = React.useRef(null);

  React.useEffect(() => {
    if (videoNode.current === null) {
      return;
    }

    const player = videojs(videoNode.current, props, function onPlayerReady() {
      console.log('onPlayerReady');
    });

    return () => {
      player.dispose();
    }
  }, [props]);

  return (
    <div data-vjs-player>
      <video ref={ videoNode } className="video-js"></video>
    </div>
  );
});
