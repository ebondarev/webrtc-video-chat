import s from './style.module.css';

interface Props {}

export const VideoContainer: React.FC<Props> = ({children}) => {
	return (
		<section className={s['video-container']}>{children}</section>
	);
};
