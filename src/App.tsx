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
import { addRemoteStream, setIdToConnect, setPeerId, setPeerToPeerNodeType, setUserName as setUserNameAction } from './AppSlice';


const constraints: MediaStreamConstraints = {
  audio: true,
  video: {
    width: 320,
    height: 240,
    facingMode: 'user',
  },
};

export type IPeerId = string;

function App() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const peerId = useAppSelector((state) => state.app.rtc.peerId);
  const idToConnect = useAppSelector((state) => state.app.rtc.idToConnect);
  const peerToPeerNodeType = useAppSelector((state) => state.app.rtc.peerToPeerNodeType);
  const peerJS = useAppSelector((state) => state.app.rtc.peerJS);

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

  React.useEffect(function connectToChat() {
    if (idToConnect === '') {
      return;
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then((localStream) => {
        const call = peerJS.call(idToConnect, localStream);
        call.on('stream', (data) => {
          const remoteStream = data as MediaStream;
          dispatch(addRemoteStream(remoteStream));
        });
      })
      .catch((error) => {

      });
  }, [ idToConnect ]);

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
