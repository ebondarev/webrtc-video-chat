import s from './style.module.css';

interface Props {
	className?: string;
	disabled?: boolean;
	onClick: () => void;
}

export const Button: React.FC<Props> = ({children, className = '', disabled = false, onClick}) => {
	return (
		<button className={`${s['button']} ${className}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
}

export const ButtonDanger: React.FC<Props> = (props) => {
	return (
		<Button {...props} className={`${props.className || ''} ${s['button_danger']}`} />
	);
}
