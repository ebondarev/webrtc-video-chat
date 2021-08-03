import s from './style.module.css';

interface Props {}

export const Aside: React.FC<Props> = ({children}) => {
	return (
		<aside className={s['aside']}>{children}</aside>
	);
};
