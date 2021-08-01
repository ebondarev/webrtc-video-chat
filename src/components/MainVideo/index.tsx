import React from 'react';
import s from './style.module.css';

export const MainVideo = React.forwardRef<HTMLVideoElement, React.MediaHTMLAttributes<HTMLVideoElement>>((props, ref) => {
	return (
		<video {...props}
			ref={ref}
			className={s['main-video__player']}
		></video>
	)
});
