import s from './ChatHeader.module.css';

export interface IChatHeaderProps {
  title: string;
  numberParticipants: number;
}

export const ChatHeader: React.FC<IChatHeaderProps> = ({ title, numberParticipants }) => {
  return (
    <div className={ s['chat-header'] }>
      <div className={ s['chat-header__title'] }>{ title }</div>
      <div className={ s['chat-header__participants'] }>{ numberParticipants } Participants</div>
    </div>
  );
};
