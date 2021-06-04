import s from './App.module.css';
import {
  // BrowserRouter,
  // Switch,
  Route,
  // Link,
  useHistory
} from "react-router-dom";
import { HomePage } from './pages/HomePage';
import React from 'react';
import { RootChatPage } from './pages/RootChatPage';
import { ClientChatPage } from './pages/ClientChatPage';
import { Content } from './containers/Content';
import { Button, Input } from 'antd';

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

export interface PeerDataConnection {
  send: (data: any) => void;
  close: () => void;
  on: (
    event: PeerEvent,
    callback: (data: any) => void
  ) => void;
  dataChannel: RTCDataChannel;
  label: string;
  metadata: any;
  open: boolean;
  peerConnection: RTCPeerConnection;
  peer: IPeerId;
  reliable: boolean;
  serialization: 'binary' | 'binary-utf8' | 'json' | 'none';
  type: string;
  bufferSize: number;
}

export type IPeerToPeerNodeType = 'root' | 'client' | null;
export type IPeerId = string;
export type PeerEvent = 'open' | 'connection' | 'call' | 'close' | 'disconnected' | 'error';
export type PeerJS = {
  connect: (id: IPeerId) => PeerDataConnection;
  on: (
    event: PeerEvent,
    fn: (data: any) => void
  ) => void;
};

function App() {
  const [ peerId, setPeerId ] = React.useState<IPeerId>('');
  const [ idToConnect, setIdToConnect ] = React.useState<IPeerId>('');
  const [ peerToPeerNodeType, setPeerToPeerNodeType ] = React.useState<IPeerToPeerNodeType>(null);
  const [ userName, setUserName ] = React.useState<string>('');

  const history = useHistory();

  const { current: peer } = React.useRef< PeerJS >( new (window as any).Peer({ config: peerConfig }) );

  React.useEffect(function fetchPeerId() {
    peer.on('open', (peerId: IPeerId) => {
      setPeerId(peerId);
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
    setPeerToPeerNodeType('root');
  }

  function connectToChat(idToConnect: IPeerId) {
    setPeerToPeerNodeType('client');
    setIdToConnect(idToConnect);
  }

  return (
    <div className={ s['app'] }>

      <Route path="/root-chat">
        <Content.Column>
          <RootChatPage
            peerId={ peerId }
            peer={ peer }
          />
        </Content.Column>
      </Route>

      <Route path="/client-chat">
        <ClientChatPage
          peerId={ peerId }
          idToConnect= { idToConnect }
          peer={ peer }
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
