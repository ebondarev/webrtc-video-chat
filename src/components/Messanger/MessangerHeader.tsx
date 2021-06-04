import s from './ChatHeader.module.css';

export interface IMessangerHeaderProps {
  title: string;
  numberParticipants: number;
}

export const MessangerHeader: React.FC<IMessangerHeaderProps> = ({ title, numberParticipants }) => {
  return (
    <div className={ s['messanger-header'] }>
      <div className={ s['messanger-header__title'] }>{ title }</div>
      <div className={ s['messanger-header__participants'] }>{ numberParticipants } Participants</div>
    </div>
  );
};
