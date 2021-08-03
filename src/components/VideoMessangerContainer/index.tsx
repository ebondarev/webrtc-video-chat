import s from './style.module.css';

interface Props {}

export const VideoMessangerContainer: React.FC<Props> = ({children}) => {
	return (
		<div className={s['video-messanger-container']}>
			{children}
		</div>
	);
};
