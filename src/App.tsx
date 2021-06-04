import s from './App.module.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { HomePage } from './pages/HomePage';
import { ChatContainer } from './components/Chat';
import React from 'react';
import { RootChatPage } from './pages/RootChatPage';
import { ClientChatPage } from './pages/ClientChatPage';

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

interface IConnectionData {
  connectedIds: string[];
}

export type IPeerToPeerNodeType = 'root' | 'client' | null;
export type IPeerId = string;

function App() {
  const [ peerId, setPeerId ] = React.useState<IPeerId>('');
  const [ connectedIds, setConnectedIds ] = React.useState<string[]>([]);
  const [ peerToPeerNodeType, setPeerToPeerNodeType ] = React.useState<IPeerToPeerNodeType>(null);

  const history = useHistory();

  const peerRef = React.useRef(
    new (window as any).Peer({ config: peerConfig })
  );
  const peer = peerRef.current;

  React.useEffect(() => {
    peer.on('open', (peerId: IPeerId) => {
      setPeerId(peerId);
      if (peerToPeerNodeType) {
        history.push('/chat');
      }
    });

    peer.on('connection', (data: IConnectionData) => {
      console.log('%c connection data ', 'background: #222; color: #bada55', data);
      // data.connectedIds - массив id к которым приконнекчен
      // setConnectedIds(
      //   Array.from(
      //     new Set([...connectedIds, ...data.connectedIds])
      //   )
      // );
    });
  }, []);

  function createChat() {
    setPeerToPeerNodeType('root');
    if (peerId) {
      history.push('/root-chat');
    }
  }

  function connectToChat() {
    setPeerToPeerNodeType('client');
    if (peerId) {
      history.push('/client-chat');
    }
  }

  return (
    <div className={ s['app'] }>

      <Route path="/root-chat">
        <RootChatPage
          peerId={ peerId }
        />
      </Route>

      <Route path="/client-chat">
        <ClientChatPage
          peerId={ peerId }
        />
      </Route>

      <Route exact path="/">
        <HomePage
          createChat={ createChat }
          connectToChat={ connectToChat }
        />
      </Route>

    </div>
  );
}

export default App;
