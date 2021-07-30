import { Avatar } from '../Avatar';
import { Message } from '../Chat';
import s from './style.module.css';

interface Props {
	message: Message;
}

export const ChatMessage: React.FC<Props> = ({message}) => {
	return (
		<div className={s['chat-messages__message']} key={message.id}>
			<Avatar avatarUrl={message.author.avatar} />
			<div className={s['chat-message__name']}>{message.author.name}</div>
			<div className={s['chat-message__text']}>{message.text}</div>
		</div>
	);
};
