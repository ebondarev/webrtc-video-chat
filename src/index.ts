import { v4 as uuidv4 } from 'uuid';
import 'normalize.css';
import './style.css';
import Peer from './vendor/peerjs';
import { throttle } from 'throttle-debounce';

interface MessageList {
  add: (message: any) => void;
  list: () => any[];
  subscribe: (fn: (message: Message) => void) => void;
  notify: () => void;
}

interface Message {
  id: string;
  type: 'deleted' | 'base' | 'joined';
  text: string;
  author: {
    name: string;
    avatar: string;
  }
}

interface User {
  name: string;
  avatar: string;
}

interface RenderVideoStreamOptions {
  isMuted: boolean;
}

interface RenderMainVideoOptions {
  src: string;
  className: string;
  controls?: boolean;
}

interface PeerConnections {
  [key: string]: (Peer.DataConnection | Peer.MediaConnection)[];
}

enum ConnectionDataTypes {
  CLIENT_IDS = 'client_ids',
  PLAYBACK_TIMESTAMP = 'playback_timestamp',
  MESSAGE_LIST = 'message_list',
  MESSAGE = 'message',
  PLAYER_EVENT = 'player_event',
  CLOSE_CONNECTION = 'close_connection',
}

window.addEventListener('DOMContentLoaded', () => {
  const peerConnections: PeerConnections = {};

  const messages: MessageList = (() => {
    const _subscribers: ((message: Message) => unknown)[] = [];
    const _messages: Message[] = [];
    return {
      add(message: Message) {
        _messages.push(message);
        this.notify();
      },
      list() {
        return [ ..._messages ];
      },
      subscribe(fn: (message: Message) => unknown ) {
        _subscribers.push(fn);
      },
      notify() {
        _subscribers.forEach((fn) => fn(this.list().slice(-1)[0]));
      },
    };
  })();

  const user: User = {
    name: 'User Name 🤩',
    avatar: 'https://cdn.iconscout.com/icon/free/png-256/avatar-366-456318.png',
  };

  const peer  = new Peer({ debug: 1 });
  peer.on('open', function fetchPeerId(id: string) {
    (document.querySelector('.peer-id') as HTMLElement).innerText = id;
  });

  // Popup
  const collectUserDataInputElement: HTMLInputElement = document.querySelector('.collect-user-data__input');
  collectUserDataInputElement.focus();
  collectUserDataInputElement.addEventListener('keydown', (e: Event) => {
    const event = e as KeyboardEvent;
    if (event.code?.toLowerCase() !== 'enter') return;
    event.preventDefault();
    applyUserName(user, collectUserDataInputElement);
  });
  document.querySelector('.collect-user-data__btn').addEventListener('click', () => {
    applyUserName(user, collectUserDataInputElement);
  });

  // Create Root
  document.querySelector('.create-root__btn')?.addEventListener('click', createRoot);

  // Create Client
  document.querySelector('.call-to__input')?.addEventListener('keydown', (e: Event) => {
    const event = e as KeyboardEvent;
    if (event.code?.toLowerCase() !== 'enter') return;
    event.preventDefault();
    createClient();
  });
  document.querySelector('.call-to__btn')?.addEventListener('click', createClient);


  /* ***************** FUNCTIONS ***************** */

  async function createRoot() {
    const localStream = await getLocalMediaStream();

    (document.querySelector('.choose-type') as HTMLElement).style.display = 'none';
    (document.querySelector('.video-messanger-container') as HTMLElement).classList.remove('video-messanger-container_hidden');
    (document.querySelector('.client-type') as HTMLElement).innerText = 'Root';

    // Мьют локального стрима чтобы избавиться от эхо
    renderVideoStream(localStream, peer.id, { isMuted: true });

    initChat(messages, document.querySelector('.chat-messages') as HTMLElement, 'root');

    const mainVideoElement = renderMainVideo(
      document.querySelector('.main-video') as HTMLElement,
      {
        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        className: 'main-video__player',
      }
    );
    const shareRootMainVideoEvents = shareMainVideoEvents.bind(null, mainVideoElement, 'Root');
    const shareRootMainVideoTimeupdate = throttle(1000, shareRootMainVideoEvents);
    mainVideoElement.addEventListener('pause', shareRootMainVideoEvents);
    mainVideoElement.addEventListener('play', shareRootMainVideoEvents);
    mainVideoElement.addEventListener('playing', shareRootMainVideoEvents);
    mainVideoElement.addEventListener('timeupdate', shareRootMainVideoTimeupdate);
    mainVideoElement.addEventListener('seeked', shareRootMainVideoEvents);
    mainVideoElement.addEventListener('waiting', shareRootMainVideoEvents);

    peer.on('call', (clientMediaConnection) => {
      saveConnection(peerConnections, clientMediaConnection);
      incrementCounterParticipants(1);
      clientMediaConnection.answer(localStream);
      clientMediaConnection.on('stream', (clientStream) => {
        renderVideoStream(clientStream, clientMediaConnection.peer);
      });
      clientMediaConnection.on('close', () => {
        // Firefox does not yet support this event.
        console.log('[LOG]', 'close media connection');
      });
    });

    peer.on('connection', (clientDataConnection) => {
      saveConnection(peerConnections, clientDataConnection);
      clientDataConnection.on('open', () => {
        Object.keys(peerConnections).forEach((clientId: string, index, arr) => {
          const listWithoutClientId = arr.filter((id) => id !== clientId);
          const dataConnection = getDataConnection(peerConnections[clientId]);
          dataConnection.send({ type: ConnectionDataTypes.CLIENT_IDS, payload: listWithoutClientId });
          dataConnection.send({ type: ConnectionDataTypes.PLAYBACK_TIMESTAMP, payload: mainVideoElement.currentTime });
        });

        clientDataConnection.send({ type: ConnectionDataTypes.MESSAGE_LIST, payload: messages.list() });
        messages.subscribe((message) => {
          clientDataConnection.send({
            type: ConnectionDataTypes.MESSAGE,
            payload: message,
          });
        });

        clientDataConnection.on('data', (data: any) => {
          if (data.type === ConnectionDataTypes.MESSAGE) {
            messages.add(data.payload);
            renderMessage(data.payload, document.querySelector('.chat-messages') as HTMLElement);
          } else if (data.type === ConnectionDataTypes.CLOSE_CONNECTION) {
            const peerId: string = data.payload;
            const mediaConnectionId = (peerConnections[peerId].find((connection) => connection.type === 'media') as Peer.MediaConnection).peer;
            const videoElement = document.querySelector(`[data-stream-id="${mediaConnectionId}"]`);
            videoElement.parentNode.removeChild(videoElement);
            delete peerConnections[peerId];
          }
        });
      });
      clientDataConnection.on('close', () => {
        // Firefox does not yet support this event.
        console.log('[LOG]', 'close data connection');
      });
    });

    setControlListeners(peerConnections, localStream, mainVideoElement);
  }

  async function createClient() {
    const localStream = await getLocalMediaStream();

    (document.querySelector('.choose-type') as HTMLElement).style.display = 'none';
    const videoMessangerContainerElement = document.querySelector('.video-messanger-container') as HTMLElement;
    videoMessangerContainerElement.classList.remove('video-messanger-container_hidden');
    videoMessangerContainerElement.classList.add('video-messanger-container_client');
    (document.querySelector('.client-type') as HTMLElement).innerText = 'Client';

    const rootPeerId = (document.querySelector('.call-to__input') as HTMLInputElement).value;

    const mainVideoElement = renderMainVideo(
      document.querySelector('.main-video') as HTMLElement,
      {
        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        className: 'main-video__player',
        controls: false,
      }
    );
    // const shareClientMainVideoEvents = shareMainVideoEvents.bind(null, mainVideoElement, 'Client', null);
    /* const handleClientMainVideoTimeupdate = throttle(1000, shareClientMainVideoEvents);
    mainVideoElement.addEventListener('pause', shareClientMainVideoEvents);
    mainVideoElement.addEventListener('play', shareClientMainVideoEvents);
    mainVideoElement.addEventListener('playing', shareClientMainVideoEvents);
    mainVideoElement.addEventListener('timeupdate', handleClientMainVideoTimeupdate);
    mainVideoElement.addEventListener('seeked', shareClientMainVideoEvents);
    mainVideoElement.addEventListener('waiting', shareClientMainVideoEvents); */

    {
      /*
      * Сразу устанавливаю MediaConnection и DataConnection чтобы
      * со страницы рута было проще отправлять данные, тк сооединения
      * будут добавлены в peerConnections
      */
      const dataConnectToRoot = peer.connect(rootPeerId, { serialization: 'json', metadata: { type: 'DataConnection', peerType: 'Root' } });
      saveConnection(peerConnections, dataConnectToRoot);
      dataConnectToRoot.on('open', () => {
        dataConnectToRoot.on('data', (dataFromRoot: any) => {
          switch(dataFromRoot.type) {
            case ConnectionDataTypes.CLIENT_IDS:
              // Установить соединение с клиентами из пришедшего фида
              dataFromRoot.payload.forEach((id: string) => {
                if (Object.keys(peerConnections).includes(id)) return;
                incrementCounterParticipants(1);
                peer.call(id, localStream);
              });
              break;
            case ConnectionDataTypes.MESSAGE_LIST:
              dataFromRoot.payload.forEach((message: Message) => {
                renderMessage(message, document.querySelector('.chat-messages') as HTMLElement);
              });
              break;
            case ConnectionDataTypes.MESSAGE:
              renderMessage(dataFromRoot.payload, document.querySelector('.chat-messages') as HTMLElement);
              break;
            case ConnectionDataTypes.PLAYER_EVENT:
              if (mainVideoElement) {
                const { eventType, playerCurrentTime, eventTimeStamp } = dataFromRoot.payload;
                if (eventType === 'pause') {
                  const isVideoBuffering = mainVideoElement.networkState === mainVideoElement.NETWORK_LOADING;
                  if (isVideoBuffering === false) {
                    mainVideoElement.currentTime = playerCurrentTime;
                    mainVideoElement.pause();
                  }
                } else if ((eventType === 'play') || (eventType === 'playing') || (eventType === 'seeked')) {
                  mainVideoElement.currentTime = playerCurrentTime;
                  mainVideoElement.play();
                } else if (eventType === 'waiting') {
                  mainVideoElement.pause();
                } else if (eventType === 'timeupdate') {
                  const currentTimeDiff = mainVideoElement.currentTime - playerCurrentTime;
                  enum playbackRate {
                    EXTRA_SLOW = 0.5,
                    SLOW = 0.75,
                    NORMAL = 1.0,
                    FAST = 1.25,
                    EXTRA_FAST = 1.5,
                  };

                  if ((Math.abs(currentTimeDiff) < 0.3) && (mainVideoElement.playbackRate !== playbackRate.NORMAL)) {
                    mainVideoElement.playbackRate = playbackRate.NORMAL;
                  } if ((0.3 <= currentTimeDiff) && (currentTimeDiff < 1.5) && (mainVideoElement.playbackRate !== playbackRate.SLOW)) {
                    mainVideoElement.playbackRate = playbackRate.SLOW;
                  } else if ((-0.3 >= currentTimeDiff) && (currentTimeDiff > -1.5) && (mainVideoElement.playbackRate !== playbackRate.FAST)) {
                    mainVideoElement.playbackRate = playbackRate.FAST;
                  } else if (currentTimeDiff >= 1.5) {
                    mainVideoElement.playbackRate = playbackRate.EXTRA_SLOW;
                  } else if (currentTimeDiff <= -1.5) {
                    mainVideoElement.playbackRate = playbackRate.EXTRA_FAST;
                  }
                }
              }
              break;
            case ConnectionDataTypes.PLAYBACK_TIMESTAMP:
              mainVideoElement.currentTime = dataFromRoot.payload;
              break;
            case ConnectionDataTypes.CLOSE_CONNECTION:
              Object.keys(peerConnections)
                .forEach((key) => {
                  peerConnections[key]
                    .forEach((connection: Peer.DataConnection | Peer.MediaConnection) => connection.close());
               });
              location.reload();
              break;
          }
        });
      });

      const mediaConnectToRoot = peer.call(rootPeerId, localStream, { metadata: { type: 'MediaConnection' } });
      saveConnection(peerConnections, mediaConnectToRoot);
      mediaConnectToRoot.on('stream', (rootMediaStream) => {
        renderVideoStream(rootMediaStream, mediaConnectToRoot.peer);
      });

      setControlListeners(peerConnections, localStream, mainVideoElement);
    }

    incrementCounterParticipants(1);

    // Мьют локального стрима чтобы избавиться от эхо
    renderVideoStream(localStream, peer.id, { isMuted: true });

    const idsOfClientsWhoseMediaStreamsAreBeingPlayed: string[] = [];
    peer.on('call', (clientMediaConnection) => {
      if (idsOfClientsWhoseMediaStreamsAreBeingPlayed.includes(clientMediaConnection.peer)) return;
      idsOfClientsWhoseMediaStreamsAreBeingPlayed.push(clientMediaConnection.peer);
      clientMediaConnection.answer(localStream);
      clientMediaConnection.on('stream', (stream: MediaStream) => {
        renderVideoStream(stream, clientMediaConnection.peer);
      });
    });

    initChat(messages, document.querySelector('.chat-messages') as HTMLElement, 'client', rootPeerId);
  }

  function shareMainVideoEvents(
    player: HTMLVideoElement,
    currentPeerType: 'Root' | 'Client',
    event: Event
  ) {
    Object.keys(peerConnections)
      .map((peerId) => getDataConnection(peerConnections[peerId]))
      .filter(Boolean)
      .forEach((dataConnection) => {
        if (
          (currentPeerType === 'Root')
          || ((currentPeerType === 'Client') && ((dataConnection.metadata as any).peerType === 'Root'))
        ) {
          dataConnection.send({
            type: ConnectionDataTypes.PLAYER_EVENT,
            payload: {
              eventType: event.type,
              playerCurrentTime: player.currentTime,
              eventTimeStamp: Date.now(),
            },
          });
        }
      });
  }

  function applyUserName(user: User, input: HTMLInputElement) {
    const userName = input.value;
    user.name = userName;
    document.querySelector('.popup').classList.add('popup_hide');
  }

  function incrementCounterParticipants(increment: number) {
    const counterElement = document.querySelector('.chat-info__counter') as HTMLElement;
    const currentValue = parseInt(counterElement.innerText.trim(), 10);
    counterElement.innerText = String(currentValue + increment);
  }

  function renderMainVideo(container: HTMLElement, options: RenderMainVideoOptions): HTMLVideoElement {
    const videoElement = document.createElement('video');
    videoElement.controls = options.controls ?? true;
    videoElement.muted = true;
    videoElement.classList.add(options.className);
    videoElement.src = options.src;
    container.appendChild(videoElement);
    videoElement.play();
    return videoElement;
  }

  function initChat(messages: MessageList, container: HTMLElement, type: 'root' | 'client', rootPeerId?: string) {
    messages.list().forEach((msg) => renderMessage(msg, container));
    document.querySelector('.chat-textarea__input-area')?.addEventListener('keyup', (e: Event) => {
      const event = e as KeyboardEvent;
      const isDesktop = document.body.clientWidth >= 1280;
      const isEnterWithoutShift = (event.code.toLowerCase() === 'enter') && (event.shiftKey === false);
      const isLastPressedEnter = ((event.target as HTMLTextAreaElement).value.slice(-1) === '\n');
      if (
        (isDesktop && isEnterWithoutShift) ||
        ((isDesktop === false) && isLastPressedEnter)
      ) {
        event.preventDefault();
        const message: Message = {
          id: uuidv4(),
          type: 'base',
          text: (event.target as HTMLTextAreaElement).value.trim(),
          author: user,
        };
        messages.add(message);
        if (type === 'root') {
          renderMessage(message, document.querySelector('.chat-messages') as HTMLElement);
        } else if ((type === 'client') && rootPeerId) {
          // Отправляет сообщение руту
          const connectToRoot = peer.connect(rootPeerId, { serialization: 'json' });
          connectToRoot.on('open', () => {
            connectToRoot.send({ type: ConnectionDataTypes.MESSAGE, payload: message });
          });
        }
        (event.target as HTMLTextAreaElement).value = '';
      }
    });
  }

  async function getLocalMediaStream() {
    const constraints = {
      audio: {
        echoCancellation: true,
      },
      video: {
        width: 270,
        facingMode: 'user',
      },
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  function renderVideoStream(stream: MediaStream, connectionId: string, options?: RenderVideoStreamOptions) {
    const isVideoAdded = Boolean(document.querySelector(`[data-stream-id="${connectionId}"]`));
    if (isVideoAdded) return;
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.classList.add('users-video__video');
    videoElement.dataset.streamId = connectionId;
    if (options?.isMuted) {
      videoElement.muted = true;
    }
    document.querySelector('.users-video')?.appendChild(videoElement);
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    }
  }

  function renderMessage(message: Message, container: HTMLElement) {
    const templates = {
      deleted(message: Message) {
        return `<div class="chat-messages__message chat-messages__message_deleted" data-id="${htmlEscape(message.id)}">
            ${this._text(htmlEscape(message.text))}
          </div>`;
      },
      base(message: Message) {
        return `<div class="chat-messages__message" data-id="${htmlEscape(message.id)}">
          ${this._avatar(htmlEscape(message.author.avatar))}
          <div class="chat-messages__name">${htmlEscape(message.author.name)}</div>
          ${this._text(htmlEscape(message.text))}
        </div>`
      },
      joined(message: Message) {
        return `<div class="chat-messages__message chat-message__message_joined" data-id="${htmlEscape(message.id)}">
          ${this._avatar(htmlEscape(message.author.avatar))}
          ${this._text(htmlEscape(message.text))}
        </div>`
      },
      _avatar(url: string) {
        return `<div class="avatar"><img src="${url}" alt=""></div>`
      },
      _text(text: string) {
        return `<div class="chat-message__text">${text}</div>`
      },
    };
    container.insertAdjacentHTML('beforeend', templates[message.type](message));
    container.scrollTop = container.scrollHeight;
  }

  function htmlEscape(strings: string | string[], ...values: any) {
    // https://github.com/sindresorhus/escape-goat/blob/main/index.js
    const _htmlEscape = (string: string) => string
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    if (typeof strings === 'string') {
      return _htmlEscape(strings);
    }
    let output = strings[0];
    for (const [index, value] of values.entries()) {
      output = output + _htmlEscape(String(value)) + strings[index + 1];
    }
    return output;
  }

  function getDataConnection(connections: any[]): Peer.DataConnection | undefined {
    return connections.find((connection) => connection.type === 'data');
  }

  function setControlListeners(peerConnections: PeerConnections, mediaStream: MediaStream, mainVideoElement: HTMLMediaElement) {
    document.querySelector('.icon__call-end')
      .addEventListener('click', function endConversation() {
        Object.keys(peerConnections)
          .forEach((key) => {
            peerConnections[key]
              .forEach((connection: Peer.DataConnection | Peer.MediaConnection) => {
                if (connection.type === 'data') {
                  (connection as Peer.DataConnection).send({ type: ConnectionDataTypes.CLOSE_CONNECTION, payload: peer.id });
                }
                connection.close();
              });
          });
        location.reload();
      });

    document.querySelector('.icon__microphone')
      .addEventListener('click', function toggleMicrophone() {
        this.classList.toggle('icon_cross');
        const audioTracks = mediaStream.getAudioTracks()
          .forEach((audioTrack) => {
            audioTrack.enabled = !audioTrack.enabled;
          });
      });

    document.querySelector('.icon__camera')
      .addEventListener('click', function toggleCamera() {
        this.classList.toggle('icon_cross');
        const videoTracks = mediaStream.getVideoTracks()
          .forEach((videoTrack) => {
            videoTrack.enabled = !videoTrack.enabled;
          });
      });

    const mainVideoVolumeRangeElement = document.querySelector('.main-video__volume .range');
    document.querySelector('.main-video__volume')
      .addEventListener('click', function toggleVolumeRange(event) {
        if ((event.target === mainVideoVolumeRangeElement) || mainVideoVolumeRangeElement.contains(event.target as Node)) return;
        this.classList.toggle('main-video__volume_shift');
        mainVideoVolumeRangeElement.classList.toggle('range_hide');
      });
    mainVideoVolumeRangeElement
      .addEventListener('click', function (event: MouseEvent) {
        const rangeStripElement = this.querySelector('.range__strip');
        rangeStripElement.style.width = `${event.offsetX}px`;
        if (mainVideoElement.muted) {
          mainVideoElement.muted = false;
        }
        mainVideoElement.volume = event.offsetX / mainVideoVolumeRangeElement.clientWidth;
      });
  }

  function saveConnection(peerConnections: PeerConnections, connect: Peer.DataConnection | Peer.MediaConnection): PeerConnections {
    if (peerConnections[connect.peer]) {
      peerConnections[connect.peer].push(connect);
    } else {
      peerConnections[connect.peer] = [connect];
    }
    return peerConnections;
  }
});
