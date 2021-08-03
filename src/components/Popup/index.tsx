import s from './style.module.css';

interface Props {
	onClose?: () => void;
}

export const Popup: React.FC<Props> = ({children, onClose}) => {
	return (
		<div className={s['popup']}>
			<div className={s['popup__background']} onClick={() => onClose?.()}></div>
			<div className={s['popup__content']}>{children}</div>
		</div>
	);
}
