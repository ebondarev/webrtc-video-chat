import { Avatar } from "../Avatar";
import s from './ChatMessage.module.css';

export interface IMessangerMessage {
  id: number;
  authorNickname: string;
  authorAvatarUrl: string;
  text: string;
  status: 'active' | 'deleted' | 'joined';
};

export interface IMessangerMessageProps {
  message: IMessangerMessage;
};

export const MessangerMessage: React.FC<IMessangerMessageProps> = ({ message }) => {
  if (message.status === 'active') {
    return (
      <div className={ `${ s['message'] } ${ s['message_active'] }` }>
        <div className={ s['message__avatar']}>
          <Avatar url={message.authorAvatarUrl} />
        </div>
        <div className={ s['message__content'] }>
          <div className={ s['message__nickname'] }>{ message.authorNickname }</div>
          <div className={ s['message__text'] }>{ message.text }</div>
        </div>
      </div>
    );
  }

  if (message.status === 'deleted') {
    return (
      <div className={ `${s['message__text']} ${s['message__text_deleted']}` }>Message deleted</div>
    );
  }

  if (message.status === 'joined') {
    return (
      <div className={ `${s['message']} ${ s['message_joined'] }` }>
        <div className={ s['message__avatar']}>
          <Avatar url={message.authorAvatarUrl} />
        </div>
        <div>{ message.authorNickname } joined the party.</div>
      </div>
    )
  }

  return (
    <div></div>
  );
};
