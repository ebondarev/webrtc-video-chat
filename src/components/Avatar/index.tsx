import s from './index.module.css';

export interface IAvatarProps {
  url: string;
}

export const Avatar: React.FC<IAvatarProps> = ({ url }) => {
  return (
    <img src={ url } alt="avatar" className={ s['avatar'] } />
  );
}