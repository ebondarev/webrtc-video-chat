import s from './index.module.css';

export interface IButtonProps {
  type?: 'circle-red' | 'rectangle-grey';
  onClick?: () => void;
}

export const Button: React.FC<IButtonProps> = ({ children, type, onClick }) => {
  let className = [];
  if (type === 'circle-red') {
    className.push(s['button_circle-red']);
  }
  if (type === 'rectangle-grey') {
    className.push(s['button_rectangle-gray']);
  }

  return (
    <button
      className={ `${ s['button'] } ${ className.join(' ') }` }
      onClick={ () => onClick?.() }
    >
      { children }
    </button>
  )
};
