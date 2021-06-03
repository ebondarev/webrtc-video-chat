import React from "react";
import { Button } from "../../components/Button";
import { Chat } from "../../components/Chat";
import { TvIcon, DisplayIcon, VideoCameraIcon, MicrophoneIcon, PhoneHangUpIcon } from "../../components/Icons";
import { IParticipantsProps, Participants } from "../../components/Participants";
import { IVideoPlayerProps, VideoPlayer } from "../../components/VideoPlayer";
import s from './index.module.css';


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

export interface IChatPageProps { }

export const ChatPage: React.FC<IChatPageProps> = () => {
  const [isTalking, setIsTalking] = React.useState<boolean>(false);

  // const inputConnectRef = React.useRef<HTMLInputElement>(null);
  // const connectRef = React.useRef<any>(null);

  // function handleClickConnect() {
  //   if (inputConnectRef.current === null) {
  //     return;
  //   }
  //   const { value } = inputConnectRef.current;
  //   connectRef.current = peer.connect(value);
  //   connectRef.current.on('open', () => {
  //     connectRef.current.on('data', (data: any) => {
  //       console.log('%c data ', 'background: #222; color: #bada55', data);
  //     });
  //   });
  // }

  // const inputMessageRef = React.useRef<HTMLInputElement>(null);

  // function handleClickMessage() {
  //   if (inputMessageRef.current === null) {
  //     return;
  //   }
  //   if (connectRef.current === null) {
  //     console.log('%c Need set connect! ', 'background: #222; color: #bada55');
  //     return;
  //   }
  //   const { value } = inputMessageRef.current;
  //   connectRef.current.send(value);
  // }

  return (
    <>
      {/* <section>
        <input type="text" ref={ inputConnectRef } />
        <button onClick={ () => handleClickConnect() }>Connect</button>
        <input type="text" ref={ inputMessageRef } />
        <button onClick={ () => handleClickMessage() }>Send</button>
      </section>

 */}
      <section className={ s['content'] }>
        <main>
          <Participants videos={ participantsVideos } />
          <VideoPlayer { ...videoPlayerOptions } />
        </main>
        <aside className={ s['aside'] }>
          <Chat />
        </aside>
      </section>

      <section>
        <footer>
          <ul className={ s['icons'] }>
            <li key="tv-icon">
              <Button>
                <TvIcon isOn={ true } />
              </Button>
            </li>
            <li key="display-icon">
              <Button>
                <DisplayIcon isOn={ true } />
              </Button>
            </li>
            <li key="video-camera-icon">
              <Button>
                <VideoCameraIcon isOn={ true } />
              </Button>
            </li>
            <li key="microphone-icon">
              <Button>
                <MicrophoneIcon isOn={ true } />
              </Button>
            </li>
            {isTalking && (
              <li key="phone-icon">
                <Button type="circle-red">
                  <PhoneHangUpIcon />
                </Button>
              </li>
            )}
          </ul>
        </footer>
      </section>
    </>
  );
}
