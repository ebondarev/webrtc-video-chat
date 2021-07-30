import React from 'react';
import s from './style.module.css';

interface Props {
	src: string;
}

export const MainVideo = React.forwardRef<HTMLVideoElement, Props>(({src}, ref) => {
	return (
		<video className={s['main-video__player']}
			src={src}
			ref={ref}
			controls
			autoPlay
		></video>
	)
});
