import s from './index.module.css';

export interface IContent {
  Column: React.FC;
}

export const Content: IContent = {
  Column: ({ children }) => {
    return (
      <div className={ `${ s['content'] } ${ s['content_column'] }` }>
        { children }
      </div>
    );
  },
};
