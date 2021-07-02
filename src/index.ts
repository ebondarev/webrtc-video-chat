import { v4 as uuidv4 } from 'uuid';
import 'normalize.css';
import './style.css';
import Peer from './vendor/peerjs';

window.addEventListener('DOMContentLoaded', () => {
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

  interface User {
    name: string;
    avatar: string;
  }

  const user: User = {
    name: 'User Name 🤩',
    avatar: 'https://cdn.iconscout.com/icon/free/png-256/avatar-366-456318.png',
  };

  const peer  = new Peer({ debug: 1 });
  peer.on('open', function fetchPeerId(id: string) {
    (document.querySelector('.peer-id') as HTMLElement).innerText = id;
  });

  // Popup
  document.querySelector('.collect-user-data__input').addEventListener('keydown', (e: Event) => {
    const event = e as KeyboardEvent;
    if (event.code?.toLowerCase() !== 'enter') return;
    event.preventDefault();
    applyUserName(user, document.querySelector('.collect-user-data__input') as HTMLInputElement);
  });
  document.querySelector('.collect-user-data__btn').addEventListener('click', () => {
    applyUserName(user, document.querySelector('.collect-user-data__input') as HTMLInputElement);
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
    (document.querySelector('.choose-type') as HTMLElement).style.display = 'none';
    (document.querySelector('.video-messanger-container') as HTMLElement).classList.remove('video-messanger-container_hidden');
    (document.querySelector('.client-type') as HTMLElement).innerText = 'Root';

    const localStream = await getLocalMediaStream();

    peer.on('call', function handleClientMediaConnection(clientMediaConnection) {
      incrementCounterParticipants(1);
      clientMediaConnection.answer(localStream);
      clientMediaConnection.on('stream', function handleClientStream(clientStream) {
        renderVideoStream(clientStream);
        Object.keys(peer.connections).forEach(function sendClientsIdConnectedClients(clientId: string, index, arr) {
          const listWithoutClientId = arr.filter((id) => id !== clientId);
          const dataConnection = getDataConnection(peer.connections[clientId]);
          dataConnection.send({ type: 'client_ids', payload: listWithoutClientId });
        });
      });
    });

    peer.on('connection', function handleClientDataConnection(clientDataConnection) {
      clientDataConnection.send({ type: 'messages', payload: messages.list() });
      messages.subscribe(function sendToClientNewMessage(message) {
        clientDataConnection.send({
          type: 'message',
          payload: message,
        });
      });
      clientDataConnection.on('data', function handleDataFromClient(data: any) {
        if (data.type === 'message') {
          messages.add(data.payload);
          renderMessage(data.payload, document.querySelector('.chat-messages') as HTMLElement);
        }
      });
    });

    // Мьют локального стрима чтобы избавиться от эхо
    renderVideoStream(localStream, { isMuted: true });

    initChat(messages, document.querySelector('.chat-messages') as HTMLElement, 'root');

    const mainVideoElement = renderMainVideo(
      document.querySelector('.main-video') as HTMLElement,
      {
        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        className: 'main-video__player',
      }
    );
    const handleRootMainVideoEvents = handleMainVideoEvents.bind(null, mainVideoElement, 'Root');
    mainVideoElement.addEventListener('pause', handleRootMainVideoEvents);
    mainVideoElement.addEventListener('play', handleRootMainVideoEvents);
    mainVideoElement.addEventListener('playing', handleRootMainVideoEvents);
    // mainVideoElement.addEventListener('timeupdate', handleRootMainVideoEvents);
    mainVideoElement.addEventListener('seeked', handleRootMainVideoEvents);
    mainVideoElement.addEventListener('waiting', handleRootMainVideoEvents);
  }

  async function createClient() {
    let mainVideoElement: HTMLVideoElement;

    (document.querySelector('.choose-type') as HTMLElement).style.display = 'none';
    (document.querySelector('.video-messanger-container') as HTMLElement).classList.remove('video-messanger-container_hidden');
    (document.querySelector('.client-type') as HTMLElement).innerText = 'Client';

    const localStream = await getLocalMediaStream();

    const rootPeerId = (document.querySelector('.call-to__input') as HTMLInputElement).value;

    {
      /*
      * Сразу устанавливаю MediaConnection и DataConnection чтобы
      * со страницы рута было проще отправлять данные, тк сооединения
      * будут добавлены в peer.connections
      */
      const dataConnectToRoot = peer.connect(rootPeerId, { serialization: 'json', metadata: { type: 'DataConnection', peerType: 'Root' } });
      dataConnectToRoot.on('open', () => {
        dataConnectToRoot.on('data', function handleDataFromRoot(dataFromRoot: any) {
          switch(dataFromRoot.type) {
            case 'client_ids':
              // Установить соединение с клиентами из пришедшего фида
              dataFromRoot.payload.forEach((id: string) => {
                if (Object.keys(peer.connections).includes(id)) return;
                incrementCounterParticipants(1);
                peer.call(id, localStream);
              });
              break;
            case 'messages':
              dataFromRoot.payload.forEach((message: Message) => {
                renderMessage(message, document.querySelector('.chat-messages') as HTMLElement);
              });
              break;
            case 'message':
              renderMessage(dataFromRoot.payload, document.querySelector('.chat-messages') as HTMLElement);
              break;
            case 'player_event':
              if (mainVideoElement) {
                const { eventType, playerCurrentTime } = dataFromRoot.payload;
                if (eventType === 'pause') {
                  mainVideoElement.currentTime = playerCurrentTime;
                  mainVideoElement.pause();
                } else if ((eventType === 'play') || (eventType === 'playing') || (eventType === 'seeked')) {
                  mainVideoElement.currentTime = playerCurrentTime;
                  mainVideoElement.play();
                } else if (eventType === 'waiting') {
                  mainVideoElement.pause();
                }
              }
              break;
          }
        });
      });

      const mediaConnectToRoot = peer.call(rootPeerId, localStream, { metadata: { type: 'MediaConnection' } });
      mediaConnectToRoot.on('stream', function handleMediaStreamFromRoot(rootMediaStream) {
        renderVideoStream(rootMediaStream);
      });
    }

    incrementCounterParticipants(1);

    // Мьют локального стрима чтобы избавиться от эхо
    renderVideoStream(localStream, { isMuted: true });

    const idsOfClientsWhoseMediaStreamsAreBeingPlayed: string[] = [];
    peer.on('call', function handleClientMediaConnection(clientMediaConnection) {
      if (idsOfClientsWhoseMediaStreamsAreBeingPlayed.includes(clientMediaConnection.peer)) return;
      idsOfClientsWhoseMediaStreamsAreBeingPlayed.push(clientMediaConnection.peer);
      clientMediaConnection.answer(localStream);
      clientMediaConnection.on('stream', (stream: MediaStream) => {
        renderVideoStream(stream);
      });
    });

    initChat(messages, document.querySelector('.chat-messages') as HTMLElement, 'client', rootPeerId);

    mainVideoElement = renderMainVideo(
      document.querySelector('.main-video') as HTMLElement,
      {
        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        className: 'main-video__player',
      }
    );
    const handleClientMainVideoEvents = handleMainVideoEvents.bind(null, mainVideoElement, 'Client');
    mainVideoElement.addEventListener('pause', handleClientMainVideoEvents);
    mainVideoElement.addEventListener('play', handleClientMainVideoEvents);
    mainVideoElement.addEventListener('playing', handleClientMainVideoEvents);
    // mainVideoElement.addEventListener('timeupdate', handleClientMainVideoEvents);
    mainVideoElement.addEventListener('seeked', handleClientMainVideoEvents);
    mainVideoElement.addEventListener('waiting', handleClientMainVideoEvents);
  }

  function handleMainVideoEvents(
    player: HTMLVideoElement,
    peerType: 'Root' | 'Client',
    event: Event
  ) {
    // Отправляет события плеера клиентам или руту
    Object.keys(peer.connections)
      .map((key) => getDataConnection(peer.connections[key]))
      .forEach((dataConnection) => {
        if (
          (peerType === 'Root')
          || ((peerType === 'Client') && ((dataConnection.metadata as any).peerType === 'Root'))
        ) {
          // Вместе с seeked передавать играет ли плеер
          dataConnection.send({
            type: 'player_event',
            payload: {
              eventType: event.type,
              playerCurrentTime: player.currentTime,
              eventTimeStamp: event.timeStamp,
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

  interface RenderMainVideoOptions {
    src: string;
    className: string;
  }

  function renderMainVideo(container: HTMLElement, options: RenderMainVideoOptions): HTMLVideoElement {
    const videoElement = document.createElement('video');
    videoElement.controls = true;
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
            connectToRoot.send({ type: 'message', payload: message });
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
        width: 320,
        height: 240,
        facingMode: 'user',
        echoCancellation: true,
      },
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  interface RenderVideoStreamOptions {
    isMuted: boolean;
  }
  
  function renderVideoStream(stream: MediaStream, options?: RenderVideoStreamOptions) {
    const isVideoAdded = Boolean(document.querySelector(`[data-stream-id="${stream.id}"]`));
    if (isVideoAdded) return;
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.classList.add('users-video__video');
    videoElement.dataset.streamId = stream.id;
    stream.getTracks().forEach(function addEchoCancellation(track) {
      const constraints = track.getConstraints();
      if (constraints.echoCancellation) return;
      track.applyConstraints({
        ...constraints,
        echoCancellation: true,
      });
    });
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
    return connections.find((connection) => (connection.metadata as any).type === 'DataConnection');
  }
});
