import React from 'react';
import { Button } from '../Button';
import s from './style.module.css';
import { useDispatch } from 'react-redux'
import { setName } from './slice';

export const UserNameField: React.FC = () => {
	const dispatch = useDispatch();
	const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	return (
		<>
			<div className={s['title']}>Enter your name:</div>
			<div className={s['input-with-button']}>
				<label className={s['input-with-button__label']}>
					<input className={s['input-with-button__input']}
						onInput={(event) => {
							const isDisabled = (event.target as HTMLInputElement).value.length === 0;
							setIsButtonDisabled(isDisabled);
						}}
						onKeyDown={(event) => {
							if (event.code?.toLowerCase() !== 'enter') return;
							event.preventDefault();
							dispatch(setName(inputRef.current?.value || ''));
						}}
						ref={inputRef}
						type="text" />
				</label>
				<Button className={s['input-with-button__button']}
					onClick={() => {
						dispatch(setName(inputRef.current?.value || ''));
					}}
					disabled={isButtonDisabled}
				>Apply</Button>
			</div>
		</>
	);
}
