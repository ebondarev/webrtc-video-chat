import s from './App.module.css';
import {
  Route,
  useHistory
} from "react-router-dom";
import { HomePage } from './pages/HomePage';
import React from 'react';
import { RootChatPage } from './pages/RootChatPage';
import { ClientChatPage } from './pages/ClientChatPage';
import { Content } from './containers/Content';
import { useAppDispatch, useAppSelector } from './hooks';
import { setIdToConnect, setPeerId, setPeerToPeerNodeType, setUserName as setUserNameAction } from './AppSlice';



export type IPeerId = string;

function App() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const peerId = useAppSelector((state) => state.app.peerId);
  const idToConnect = useAppSelector((state) => state.app.idToConnect);
  const peerToPeerNodeType = useAppSelector((state) => state.app.peerToPeerNodeType);
  const peerJS = useAppSelector((state) => state.app.peerJS);

  React.useEffect(function fetchPeerId() {
    peerJS.on('open', (peerId: IPeerId) => {
      dispatch(setPeerId(peerId));
    });
  }, []);

  React.useEffect(function redirectToChatPage() {
    if (peerId === '') {
      return;
    }
    if (peerToPeerNodeType === 'root') {
      return history.push('/root-chat');
    }
    if (peerToPeerNodeType === 'client') {
      return history.push('/client-chat');
    }
  }, [ peerId, peerToPeerNodeType ]);

  function createChat() {
    dispatch(setPeerToPeerNodeType('root'));
  }

  function connectToChat(idToConnect: IPeerId) {
    dispatch(setPeerToPeerNodeType('client'));
    dispatch(setIdToConnect(idToConnect));
  }

  function setUserName(name: string) {
    dispatch(setUserNameAction(name));
  }

  return (
    <div className={ s['app'] }>

      <Route path="/root-chat">
        <Content.Column>
          <RootChatPage
            peerId={ peerId }
            peerJS={ peerJS }
          />
        </Content.Column>
      </Route>

      <Route path="/client-chat">
        <ClientChatPage
          peerId={ peerId }
          idToConnect= { idToConnect }
          peerJS={ peerJS }
        />
      </Route>

      <Route exact path="/">
        <HomePage
          createChat={ createChat }
          connectToChat={ connectToChat }
          setUserName={ setUserName }
        />
      </Route>

    </div>
  );
}

export default App;
