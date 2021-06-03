import React from 'react';
import s from './App.module.css';
import { Button } from './components/Button';
import { Chat } from './components/Chat';
import { DisplayIcon, MicrophoneIcon, PhoneHangUpIcon, TvIcon, VideoCameraIcon } from './components/Icons';
import { IParticipantsProps, Participants } from './components/Participants';
import { IVideoPlayerProps, VideoPlayer } from './components/VideoPlayer';
import { peerToPeer } from './utils/peerToPeer';

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

const videoPlayerOptions: IVideoPlayerProps = {
  autoplay: true,
  controls: true,
  sources: [{
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video/mp4'
  }],
  fluid: true,
};

const participantsVideos: IParticipantsProps['videos'] = [
  {
    id: 0,
    autoplay: true,
    width: 300,
    height: 150,
    sources: [{
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'video/mp4',
    }],
    fluid: true,
  }, {
    id: 1,
    autoplay: true,
    width: 300,
    height: 150,
    sources: [{
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'video/mp4',
    }],
    fluid: true,
  },
];

interface IConnectionData {
  connectedIds: string[];
}

function App() {
  const [ isTalking, setIsTalking ] = React.useState<boolean>(false);
  const [ peerId, setPeerId ] = React.useState<string>();
  const [ connectedIds, setConnectedIds ] = React.useState<string[]>([]);

  const peerRef = React.useRef(
    new (window as any).Peer({ config: peerConfig })
  );
  const peer = peerRef.current;

  React.useEffect(() => {
    peer.on('open', (peerId: string) => {
      setPeerId(peerId);
      console.log('%c peerId ', 'background: #222; color: #bada55', peerId);
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



  const inputConnectRef = React.useRef<HTMLInputElement>(null);
  const connectRef = React.useRef<any>(null);

  function handleClickConnect() {
    if (inputConnectRef.current === null) {
      return;
    }
    const { value } = inputConnectRef.current;
    connectRef.current = peer.connect(value);
    connectRef.current.on('open', () => {
      connectRef.current.on('data', (data: any) => {
        console.log('%c data ', 'background: #222; color: #bada55', data);
      });
    });
  }

  const inputMessageRef = React.useRef<HTMLInputElement>(null);

  function handleClickMessage() {
    if (inputMessageRef.current === null) {
      return;
    }
    if (connectRef.current === null) {
      console.log('%c Need set connect! ', 'background: #222; color: #bada55');
      return;
    }
    const { value } = inputMessageRef.current;
    connectRef.current.send(value);
  }




  return (
    <div className={s['app']}>
      <section>
        <input type="text" ref={ inputConnectRef } />
        <button onClick={ () => handleClickConnect() }>Connect</button>
        <input type="text" ref={ inputMessageRef } />
        <button onClick={ () => handleClickMessage() }>Send</button>
      </section>


      <section className={s['content']}>
        <main>
          <Participants videos={participantsVideos} />
          <VideoPlayer {...videoPlayerOptions} />
        </main>
        <aside className={s['aside']}>
          <Chat />
        </aside>
      </section>

      <section>
        <footer>
          <ul className={s['icons']}>
            <li key="tv-icon">
              <Button>
                <TvIcon isOn={true} />
              </Button>
            </li>
            <li key="display-icon">
              <Button>
                <DisplayIcon isOn={true} />
              </Button>
            </li>
            <li key="video-camera-icon">
              <Button>
                <VideoCameraIcon isOn={true} />
              </Button>
            </li>
            <li key="microphone-icon">
              <Button>
                <MicrophoneIcon isOn={true} />
              </Button>
            </li>
            {isTalking && (
              <li key="phone-icon">
                <Button form="circle" backgroundColor="red">
                  <PhoneHangUpIcon />
                </Button>
              </li>
            )}
          </ul>
        </footer>
      </section>
    </div>
  );
}

export default App;
