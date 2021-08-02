import { Button, ButtonDanger } from '../Button';
import s from './style.module.css';

export interface WaitingItem {
	id: string;
	name: string;
};

interface Props {
	waitingList: WaitingItem[];
	handleAdd: (id: string) => void;
	handleRemove: (id: string) => void;
}

export const WaitingList: React.FC<Props> = ({ waitingList, handleAdd, handleRemove }) => {
	return (
		<>
			<div className={s['title']}>Waiting list:</div>
			<ul className={s['waiting-list']}>
				{waitingList.map(({ id, name }) => {
					return (
						<li className={s['waiting-list-item']} key={id}>
							<div className={s['waiting-list-item__name']}>{name}</div>
							<div className={s['waiting-list-item__controls']}>
								<Button onClick={() => handleAdd(id)}>+</Button>
								<ButtonDanger onClick={() => handleRemove(id)}>-</ButtonDanger>
							</div>
						</li>
					);
				})}
			</ul>
		</>
	);
};
