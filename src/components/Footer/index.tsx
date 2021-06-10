import { Button } from 'antd';
import { TvIcon, DisplayIcon, VideoCameraIcon, MicrophoneIcon, PhoneHangUpIcon } from "../Icons";
import s from './index.module.css';

export interface FooterProps {
  isTalking: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isTalking }) => {
  return (
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
  )
}