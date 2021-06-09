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
import { setRootPeerId, setPeerId, setPeerToPeerNodeType, setUserName as setUserNameAction } from './AppSlice';
import { PeerJS } from './models';

const peerConfig = {
  'iceServers': [
    { url: 'stun:stun01.sipphone.com' },
    { url: 'stun:stun.ekiga.net' },
    { url: 'stun:stun.fwdnet.net' },
    { url: 'stun:stun.ideasip.com' },
    { url: 'stun:stun.iptel.org' },
    { url: 'stun:stun.rixtelecom.se' },
    { url: 'stun:stun.schlund.de' },
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' },
    { url: 'stun:stun3.l.google.com:19302' },
    { url: 'stun:stun4.l.google.com:19302' },
    { url: 'stun:stunserver.org' },
    { url: 'stun:stun.softjoys.com' },
    { url: 'stun:stun.voiparound.com' },
    { url: 'stun:stun.voipbuster.com' },
    { url: 'stun:stun.voipstunt.com' },
    { url: 'stun:stun.voxgratia.org' },
    { url: 'stun:stun.xten.com' },
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }
  ]
};

function App() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const peerId = useAppSelector((state) => state.app.rtc.peerId);
  const rootPeerId = useAppSelector((state) => state.app.rtc.rootPeerId);
  const peerToPeerNodeType = useAppSelector((state) => state.app.rtc.peerToPeerNodeType);

  const peerJSRef = React.useRef<PeerJS>(new (window as any).Peer({ config: peerConfig, debug: 3 }));
  const peerJS = peerJSRef.current;

  React.useEffect(function __forDebug__() {
    (window as any).peerJS = peerJS;
  }, []);

  React.useEffect(function fetchPeerId() {
    peerJS.on('open', (peerId: string) => {
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

  function connectToChat(idToConnect: string) {
    dispatch(setPeerToPeerNodeType('client'));
    dispatch(setRootPeerId(idToConnect));
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
          rootPeerId= { rootPeerId }
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
