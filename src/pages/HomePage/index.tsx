import React from "react";
import { Button } from "../../components/Button";
import s from './index.module.css';

export interface IHomePageProps {
  handleCreateChat: () => void;
  handleConnectToChat: () => void;
}

export const HomePage: React.FC<IHomePageProps> = ({ handleCreateChat, handleConnectToChat }) => {
  return (
    <div className={ s['home-page'] }>
      <Button
        type="rectangle-grey"
        onClick={ handleCreateChat }
      >
        Create Chat
      </Button>

      <Button
        type="rectangle-grey"
        onClick={ handleConnectToChat }
      >
        Connect To Chat
      </Button>
    </div>
  );
};
