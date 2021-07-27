import s from './style.module.css';

interface Props {
	isShow: boolean;
}

export const Popup: React.FC<Props> = ({children, isShow}) => {
	return (
		<div className={`${s['popup']} ${isShow ? '' : s['popup_hide']}`}>
			<div className={s['popup__background']}></div>
			<div className={s['popup__content']}>{children}</div>
		</div>
	);
}
