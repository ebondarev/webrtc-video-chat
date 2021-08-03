import s from './style.module.css';

interface Props {
	avatarUrl: string;
}

export const Avatar: React.FC<Props> = ({avatarUrl}) => {
	return (
		<div className={s['avatar']}>
			<img src={avatarUrl} alt="" />
		</div>
	);
};
