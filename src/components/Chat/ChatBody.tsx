import React from "react";
import { ChatMessage, IChatMessage } from "./ChatMessage";
import s from './ChatBody.module.css';

export interface IChatBodyProps {
  messages: IChatMessage[];
}

export const ChatBody: React.FC<IChatBodyProps> = ({ messages }) => {
  return (
    <ul className={ s['chat-body'] }>
      {messages.map((message) => {
        return (
          <li key={ message.id } className={ s['chat-body__item'] }>
            <ChatMessage message={ message } />
          </li>
        )
      })}
    </ul>
  );
};
