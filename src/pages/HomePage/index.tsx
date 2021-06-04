import React from "react";
// import { Button } from "../../components/Button";
import { Button, Input } from 'antd';
import s from './index.module.css';

const { Search } = Input;

export interface IHomePageProps {
  createChat: () => void;
  connectToChat: () => void;
}

export const HomePage: React.FC<IHomePageProps> = ({ createChat, connectToChat }) => {

  function handleSearch(event: string) {
    if (event === '') {
      return;
    }
    connectToChat();
  }

  return (
    <div className={ s['home-page'] }>
      <Button
        className={ s['button_fluid'] }
        type="primary"
        size="large"
        onClick={ createChat }
      >
        Create Chat
      </Button>

      <Search
        allowClear
        enterButton="Connect"
        size="large"
        onSearch={ handleSearch }
      />
    </div>
  );
};
