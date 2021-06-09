import React from "react";
import { Button, Input } from 'antd';
import s from './index.module.css';
import Modal from "antd/lib/modal/Modal";

const { Search } = Input;

export interface IHomePageProps {
  createChat: () => void;
  connectToChat: (idToConnect: string) => void;
  setUserName: (name: string) => void;
}

export const HomePage: React.FC<IHomePageProps> = ({ createChat, connectToChat, setUserName }) => {
  const [ isModalVisible, setIsModalVisible ] = React.useState< boolean >(true);

  function handleSearch(idToConnect: string) {
    if (idToConnect === '') {
      return;
    }
    connectToChat(idToConnect);
  }

  function handleUserName(name: string) {
    if (name === '') {
      return;
    }
    setUserName(name);
    setIsModalVisible(false);
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

      <Modal
        title="Enter user name"
        closable={ false }
        visible={ isModalVisible }
        footer={ null }
      >
        <Search
          allowClear
          enterButton="Apply"
          size="large"
          onSearch={ handleUserName }
        />
      </Modal>
    </div>
  );
};
