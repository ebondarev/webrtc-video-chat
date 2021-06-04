import React from "react";
import { MessangerMessage, IMessangerMessage } from "./MessangerMessage";
import s from './MessangerBody.module.css';

export interface IMessangerBodyProps {
  messages: IMessangerMessage[];
}

export const MessangerBody: React.FC<IMessangerBodyProps> = ({ messages }) => {
  return (
    <ul className={ s['messanger-body'] }>
      {messages.map((message) => {
        return (
          <li key={ message.id } className={ s['messanger-body__item'] }>
            <MessangerMessage message={ message } />
          </li>
        );
      })}
    </ul>
  );
};
