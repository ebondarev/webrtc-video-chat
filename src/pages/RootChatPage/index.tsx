import React from "react";
import { IPeerId } from "../../App";
import { Chat } from "../../components/Chat";
import { Typography } from 'antd';
import { PeerDataConnection, PeerJS } from "../../AppSlice";

export interface IRootChatPage {
  peerId: IPeerId;
  peerJS: PeerJS;
}

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId, peerJS }) => {
  const [ connectedClientsIds, setConnectedClientsIds ] = React.useState< IPeerId[] >([]);

  React.useEffect(function handleClientsConnection() {
    peerJS.on('connection', (connect: PeerDataConnection) => {
      const peerId = connect.peer;
      if (connectedClientsIds.includes(peerId)) {
        return;
      }
      setConnectedClientsIds((ids) => [...ids, peerId]);
    });

    peerJS.on('call', (call) => {
      (window as any).my_call = call;
      console.log('%c call ', 'background: #222; color: #bada55', call);
      call.answer();
      setTimeout(function () {
        console.log('%c timeout ', 'background: #222; color: #bada55');
        var video = document.createElement('video');
        video.srcObject = call.remoteStream;
        video.onloadedmetadata = function (e) {
            video.play();
        };
      }, 1500);
      // var video = document.createElement('video') as HTMLVideoElement;
      // video.srcObject = call.remoteStream;
      // document.body.appendChild(video);
      // call.on('stream', (stream: MediaStream) => {
      //   console.log('%c stream ', 'background: #222; color: #bada55', stream);
      //   const video = document.createElement('video') as HTMLVideoElement;
      //   document.body.appendChild(video);
      //   video.srcObject = stream;
      //   video.style.border = '2px solid red';
      // });
    });
  }, [ peerJS ]);

  React.useEffect(function handleChangeConnectedClients() {
    console.log('%c connectedClientsIds ', 'background: black; color: white;', connectedClientsIds);
  }, [ connectedClientsIds ]);

  return (
    <>
      <Typography.Title
        level={3}
        style={{ color: 'rgb(209, 209, 209)' }}
      >
        ID: { peerId }
      </Typography.Title>
      <Chat peerId={ peerId } />
    </>
  );
}
