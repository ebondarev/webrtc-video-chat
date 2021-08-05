import React from "react";
import { VideoFromMediaStream } from "../VideoFromMediaStream";
import s from './style.module.css';

interface Props {
	streams: MediaStream[];
}

export const UsersVideo: React.FC<Props> = ({streams}) => {
	return (
		<div className={s['users-video']}>
			{streams.map((stream, index) => <VideoFromMediaStream key={stream.id} stream={stream} muted={index === 0} />)}
		</div>
	);
};
