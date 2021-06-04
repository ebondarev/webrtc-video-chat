import React from "react";
import { MessangerBody } from "./MessangerBody";
import { MessangerHeader } from "./MessangerHeader";
import { IMessangerMessage } from "./MessangerMessage";
import s from './index.module.css';

const messages: IMessangerMessage[] = [
  {
    id: 0,
    authorNickname: 'some name 😊',
    authorAvatarUrl: 'https://cdn.iconscout.com/icon/free/png-256/avatar-366-456318.png',
    text: 'Hi guys!!!',
    status: 'active',
  }, {
    id: 1,
    authorNickname: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    authorAvatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHg_t3WBJBy4SEC_9uU-gi71PNXXdInw5uRQ&usqp=CAU',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    status: 'active',
  }, {
    id: 2,
    authorNickname: 'Lorem Ipsum',
    authorAvatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHg_t3WBJBy4SEC_9uU-gi71PNXXdInw5uRQ&usqp=CAU',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    status: 'deleted',
  }, {
    id: 3,
    authorNickname: 'Lorem Ipsum 🐱‍🚀',
    authorAvatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHg_t3WBJBy4SEC_9uU-gi71PNXXdInw5uRQ&usqp=CAU',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    status: 'joined',
  },
];

export interface IMessangerProps {}

export const Messanger: React.FC<IMessangerProps> = () => {
  return (
    <div className={ s['messanger'] }>
      <MessangerHeader
        title="Party Chat"
        numberParticipants={ 9 }
      />

      <MessangerBody
        messages={ messages }
      />
    </div>
  );
};
