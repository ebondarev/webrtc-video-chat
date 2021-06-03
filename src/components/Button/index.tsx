import s from './index.module.css';

export interface IButtonProps {
  form?: 'circle';
  backgroundColor?: 'red';
}

export const Button: React.FC<IButtonProps> = ({ children, form, backgroundColor }) => {
  let className = '';
  if (backgroundColor === 'red') {
    className += ` ${ s['button_red'] }`;
  }
  if (form === 'circle') {
    className += ` ${ s['button_circle'] }`;
  }

  return (
    <button className={ `${ s['button'] } ${ className }` }>{children}</button>
  )
};
