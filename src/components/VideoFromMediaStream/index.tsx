import React from "react";
import s from './style.module.css';

interface Props {
	stream: MediaStream;
}

export const VideoFromMediaStream: React.FC<Props> = ({stream}) => {
	const videoRef = React.useRef<HTMLVideoElement>(null);

	React.useEffect(() => {
		if (videoRef.current === null) return;
		const video = videoRef.current;
		video.srcObject = stream;
		const startPlayback = () => video?.play();	
		video.addEventListener('loadedmetadata', startPlayback);
		return () => video?.removeEventListener('loadedmetadata', startPlayback);
	}, [stream]);

	return (<video className={s['users-video__video']} ref={videoRef}></video>);
};
