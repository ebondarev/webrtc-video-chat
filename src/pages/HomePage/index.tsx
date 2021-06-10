import React from "react";
import { Button, Input } from 'antd';
import s from './index.module.css';
import Modal from "antd/lib/modal/Modal";

const { Search } = Input;

export interface IHomePageProps {
  chooseRoot: () => void;
  chooseClient: (idToConnect: string) => void;
  setUserName: (name: string) => void;
}

export const HomePage: React.FC<IHomePageProps> = ({ chooseRoot, chooseClient, setUserName }) => {
  const [ isModalVisible, setIsModalVisible ] = React.useState< boolean >(true);

  function handleInputRootId(rootId: string) {
    if (rootId === '') {
      return;
    }
    chooseClient(rootId);
  }

  function handleInputUserName(name: string) {
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
        onClick={ chooseRoot }
      >
        Create Chat
      </Button>

      <Search
        allowClear
        enterButton="Connect"
        size="large"
        onSearch={ handleInputRootId }
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
          onSearch={ handleInputUserName }
        />
      </Modal>
    </div>
  );
};
