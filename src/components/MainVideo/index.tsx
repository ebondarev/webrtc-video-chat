import React from 'react';
import videojs from 'video.js';
import "video.js/dist/video-js.css";
import s from './style.module.css';

export const MainVideo = React.forwardRef<HTMLVideoElement, React.MediaHTMLAttributes<HTMLVideoElement>>((props, ref) => {
	React.useEffect(() => {
		console.log('[LOG]', 'ref', ref);
	});
	
	return (
		<div data-vjs-player>
			<video {...props}
				ref={ref}
				className={s['main-video__player']}
			></video>
		</div>
	)
});
