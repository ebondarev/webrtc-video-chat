import React from 'react';
import { useAppSelector } from '../../hooks/useStore';
import { ChatMessage } from '../ChatMessage';
import s from './style.module.css';

export interface Message {
	id: string;
	text: string;
	author: {
		name: string;
		avatar: string;
	}
}

interface Props {
	numberParticipants: number;
	messages: Message[];
	handleNewMessage: (message: Message) => void;
}

export const Chat: React.FC<Props> = ({numberParticipants, messages, handleNewMessage}) => {
	// const [messages, setMessages] = React.useState<Message[]>([]);
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	const user = useAppSelector((state) => state.user);

	function handleKeyDownTextarea(event: React.KeyboardEvent) {
		const textarea = textareaRef.current;
		if ((event.shiftKey === false) && (event.key === 'Enter') && textarea) {
			event.preventDefault();
			// setMessages([...messages, {id: Date.now().toString(), text: textarea.value, author: user}]);
			handleNewMessage({id: Date.now().toString(), text: textarea.value, author: user});
			textarea.value = '';
		}
	}

	return (
		<div className={s['chat']}>
			<div className={s['chat-info']}>
				<div className={s['chat-info__title']}>Party Chat</div>
				<div className={s['chat-info__participants']}><span>{numberParticipants}</span> Participants</div>
			</div>
			<div className={s['chat-messages-container']}>
				<div className={s['chat-messages']}>
					{messages.map((message) => {
						return <ChatMessage message={message} key={message.id} />;
					})}
				</div>
			</div>
			<div className={s['chat-textarea']}>
				<textarea className={s['chat-textarea__input-area']}
					ref={textareaRef}
					onKeyDown={handleKeyDownTextarea}
				></textarea>
			</div>
		</div>
	);
};
