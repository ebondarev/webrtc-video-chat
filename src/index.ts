import 'normalize.css';
import './style.css';

window.addEventListener('DOMContentLoaded', () => {
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

  interface Messages {
    add: (message: any) => void;
    get: () => any[];
    subscribe: (fn: () => void) => void;
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
  
  const messages: Messages = (() => {
    const _subscribers: ((message: Message) => unknown)[] = [];
    const _messages: Message[] = [];
    return {
      add(message: any) {
        _messages.push(message);
        this.notify();
      },
      get() {
        return [ ..._messages ];
      },
      subscribe(fn: (message: Message) => unknown ) {
        _subscribers.push(fn);
      },
      notify() {
        _subscribers.forEach((fn) => fn(this.get().slice(-1)[0]));
      },
    };
  })();

  const user = {
    name: 'Some name 🐱‍👤',
    avatar: 'https://cdn.iconscout.com/icon/free/png-256/avatar-366-456318.png',
  };

  const peer = new (window as any).Peer({ config: peerConfig, debug: 1 });

  peer.on('open', function fetchPeerId(id: string) {
    (document.querySelector('.peer-id') as HTMLElement).innerText = id;
  });

  // Create Root
  document.querySelector('.create-root__btn').addEventListener('click', async () => {
    (document.querySelector('.choose-type') as HTMLElement).style.display = 'none';
    document.querySelector('.video-messanger-container').classList.remove('video-messanger-container_hidden');
    (document.querySelector('.client-type') as HTMLElement).innerText = 'Root';

    const localStream = await getLocalMediaStream();

    const streamingClientIds = new Set<string>();
    peer.on('call', function handleClientCall(clientCall: any) {
      clientCall.answer(localStream);
      clientCall.on('stream', function handleClientStream(clientStream: MediaStream) {
        renderVideoStream(clientStream);
        const streamingClientIdsLengthBeforeAdding = streamingClientIds.size;
        streamingClientIds.add(clientCall.peer);
        if ((streamingClientIds.size > 1) && (streamingClientIdsLengthBeforeAdding !== streamingClientIds.size)) {
          // Проинформировать клиентов об изменении в подключенных клиентах
          Array.from(streamingClientIds.values()).forEach((clientId, index, arr) => {
            const listWithoutClientId = arr.filter((id) => id !== clientId);
            const connection = peer.connect(clientId);
            connection.on('open', () => {
              connection.send({type: 'client_ids', payload: listWithoutClientId});
            });
          });
        }
      });
    });

    renderVideoStream(localStream);

    initChat(messages, document.querySelector('.chat-messages'));
  });


  // Create Client
  document.querySelector('.call-to__btn').addEventListener('click', async () => {
    (document.querySelector('.choose-type') as HTMLElement).style.display = 'none';
    document.querySelector('.video-messanger-container').classList.remove('video-messanger-container_hidden');
    (document.querySelector('.client-type') as HTMLElement).innerText = 'Client';

    const localStream = await getLocalMediaStream();

    const idForConnect = (document.querySelector('.call-to__input') as HTMLInputElement).value;
    const callToRoot = peer.call(idForConnect, localStream);
    callToRoot.on('stream', function handleRootStream(rootStream: MediaStream) {
      renderVideoStream(rootStream);
    });

    renderVideoStream(localStream);

    // Обрабатывает присылаемые данные
    const connectedClients: string[] = [];
    peer.on('connection', (connection: any) => {
      connection.on('open', () => {
        connection.on('data', (data: any) => {
          if (data.type === 'client_ids') {
            // Установить соединение с клиентами из списка
            data.payload.forEach((id: string) => {
              if (connectedClients.includes(id)) return;
              connectedClients.push(id);
              peer.call(id, localStream);
            });
          }
        });
      });
    });

    // Обрабатывает стримы от других клиентов
    const idsOfPlayingClients: string[] = [];
    peer.on('call', (call: any) => {
      if (idsOfPlayingClients.includes(call.peer)) return;
      idsOfPlayingClients.push(call.peer);
      // peer.call(call.peer, localStream);
      call.answer(localStream);
      call.on('stream', (stream: MediaStream) => {
        renderVideoStream(stream);
      });
    });

    initChat(messages, document.querySelector('.chat-messages'));
  });



  /* ***************** FUNCTIONS ***************** */

  function initChat(messages: Messages, container: HTMLElement) {
    // debugger;
    messages.get().forEach((msg) => renderMessage(msg, container));
    document.querySelector('.chat-textarea__input-area').addEventListener('keydown', (event: KeyboardEvent) => {
      if ((event.code.toLowerCase() === 'enter') && (event.shiftKey === false)) {
        event.preventDefault();
        const message: Message = {
          id: (window as any).uuid.v4(),
          type: 'base',
          text: (event.target as HTMLTextAreaElement).value.trim(),
          author: user,
        };
        messages.add(message);
        renderMessage(message, document.querySelector('.chat-messages'));
        (event.target as HTMLTextAreaElement).value = '';
      }
    });
  }

  async function getLocalMediaStream() {
    const constraints = {
      audio: true,
      video: {
        width: 320,
        height: 240,
        facingMode: 'user',
      },
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  function renderVideoStream(stream: MediaStream) {
    const isVideoAdded = Boolean(document.querySelector(`[data-stream-id="${stream.id}"]`));
    if (isVideoAdded) return;
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.dataset.streamId = stream.id;
    document.querySelector('.users-video').appendChild(videoElement);
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
});