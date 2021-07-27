import { Button, ButtonDanger } from '../Button';
import s from './style.module.css';

export const WaitingList: React.FC = () => {
	return (
		<>
			<div className={s['title']}>Show waiting list:</div>
			<ul className={s['waiting-list']}>
				<li className={s['waiting-list-item']}>
					<div className={s['waiting-list-item__name']}>Name</div>
					<div className={s['waiting-list-item__controls']}>
						<Button onClick={() => {}}>Add</Button>
						<ButtonDanger onClick={() => {}}>Remove</ButtonDanger>
					</div>
				</li>
			</ul>
		</>
	);
};
