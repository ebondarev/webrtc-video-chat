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

  const peer = new Peer({ config: peerConfig, debug: 1 });

  peer.on('open', function fetchPeerId(id) {
    document.querySelector('.peer-id').innerText = id;
  });

  // Create Root
  document.querySelector('.create-root__btn').addEventListener('click', async () => {
    document.querySelector('.choose-type').style.display = 'none';
    document.querySelector('.chat-page').style.display = 'block';
    document.querySelector('.client-type').innerText = 'Root';

    const localStream = await getLocalMediaStream();

    const streamingClientIds = new Set();
    peer.on('call', function handleClientCall(clientCall) {
      clientCall.answer(localStream);
      clientCall.on('stream', function handleClientStream(clientStream) {
        renderVideoStream(clientStream);
        const streamingClientIdsLengthBeforeAdding = streamingClientIds.size;
        streamingClientIds.add(clientCall.peer);
        if ((streamingClientIds.size > 1) && (streamingClientIdsLengthBeforeAdding !== streamingClientIds.size)) {
          // Проинформировать клиентов об изменении в подключенных клиентах
          [...streamingClientIds.values()].forEach((clientId, index, arr) => {
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
  });


  // Create Client
  document.querySelector('.call-to__btn').addEventListener('click', async () => {
    document.querySelector('.choose-type').style.display = 'none';
    document.querySelector('.chat-page').style.display = 'block';
    document.querySelector('.client-type').innerText = 'Client';

    const localStream = await getLocalMediaStream();

    const idForConnect = document.querySelector('.call-to__input').value;
    const callToRoot = peer.call(idForConnect, localStream);
    callToRoot.on('stream', function handleRootStream(rootStream) {
      renderVideoStream(rootStream);
    });

    renderVideoStream(localStream);

    // Обрабатывает присылаемые данные
    const connectedClients = [];
    peer.on('connection', (connection) => {
      connection.on('open', () => {
        connection.on('data', (data) => {
          if (data.type === 'client_ids') {
            // Установить соединение с клиентами из списка
            data.payload.forEach((id) => {
              if (connectedClients.includes(id)) return;
              connectedClients.push(id);
              peer.call(id, localStream);
            });
          }
        });
      });
    });

    // Обрабатывает стримы от других клиентов
    const idsOfPlayingClients = [];
    peer.on('call', (call) => {
      if (idsOfPlayingClients.includes(call.peer)) return;
      idsOfPlayingClients.push(call.peer);
      // peer.call(call.peer, localStream);
      call.answer(localStream);
      call.on('stream', (stream) => {
        renderVideoStream(stream);
      });
    });
  });



  /* ***************** HELPERS ***************** */

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


  function renderVideoStream(stream) {
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
});
