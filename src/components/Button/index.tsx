import React from 'react';
import s from './style.module.css';

interface Props {
	className?: string;
	disabled?: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(({children, className = '', disabled = false, onClick}, ref) => {
	return (
		<button className={`${s['button']} ${className}`}
			onClick={onClick}
			disabled={disabled}
			ref={ref}
		>
			{children}
		</button>
	);
});

export const ButtonDanger = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
	return (
		<Button {...props} className={`${props.className || ''} ${s['button_danger']}`} ref={ref} />
	);
});
