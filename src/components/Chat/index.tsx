import React from "react";
import { useHistory } from "react-router";
import { Button } from 'antd';
import { Messanger } from "../Messanger";
import { TvIcon, DisplayIcon, VideoCameraIcon, MicrophoneIcon, PhoneHangUpIcon } from "../Icons";
import { Participants } from "../Participants";
import s from './index.module.css';
import { AppContext } from "../../App";


export interface IChatProps { }

export const Chat: React.FC<IChatProps> = () => {
  const history = useHistory();
  const { localPeerId } = React.useContext(AppContext);
 
  const [ isTalking, setIsTalking ] = React.useState<boolean>(false);

  if (localPeerId === '') {
    history.push('/');
  }

  return (
    <>
      <section className={ s['content'] }>
        <main>
          {/* <Participants videos={ participantsVideos } /> */}
          {/* <VideoPlayer { ...videoPlayerOptions } /> */}
        </main>
        <aside className={ s['aside'] }>
          <Messanger />
        </aside>
      </section>

      <section>
        <footer>
          <ul className={ s['icons'] }>
            <li key="tv-icon">
              <Button
                type="text"
                className={ s['button'] }
              >
                <TvIcon isOn={ true } />
              </Button>
            </li>
            <li key="display-icon">
              <Button
                type="text"
                className={ s['button'] }
              >
                <DisplayIcon isOn={ true } />
              </Button>
            </li>
            <li key="video-camera-icon">
              <Button
                type="text"
                className={ s['button'] }
              >
                <VideoCameraIcon isOn={ true } />
              </Button>
            </li>
            <li key="microphone-icon">
              <Button
                type="text"
                className={ s['button'] }
              >
                <MicrophoneIcon isOn={ true } />
              </Button>
            </li>
            {isTalking && (
              <li key="phone-icon">
                <Button
                  shape="circle"
                  danger
                  className={ s['button'] }
                >
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
