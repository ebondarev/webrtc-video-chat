export interface PeerJSConstructor {
  (id: string, options: PeerJSConstructorOptions): PeerJS;
}

export interface PeerJSConstructorOptions {
  key: string;
  host: string;
  port: string;
  pingInterval: number;
  path: string;
  secure: boolean;
  config: {
    iceServers: {
      urls: string;
      sdpSemantics: string;
    }[];
  }
  debug: number;
}

export type PeerJSOnEvent = 'open' | 'connection' | 'call' | 'close' | 'disconnected' | 'error';
export type PeerJSOnCallback = ((id: string) => void)
  | ((data: PeerJSDataConnect) => void)
  | ((media: PeerJSMediaConnection) => void)
  | ((error: PeerJSError) => void)
  | (() => void);

export interface PeerJS {
  connect: (id: string, options?: PeerJSConnectOptions) => PeerJSDataConnect;
  call: (id: string, stream: MediaStream, options?: PeerJSCallOptions) => PeerJSMediaConnection;
  on: (event: PeerJSOnEvent, callback: PeerJSOnCallback) => void;
  disconnect: () => void;
  reconnect: () => void;
  destroy: () => void;
  id: string;
  connections: PeerJSConnections;
  disconnected: boolean;
  destroyed: boolean;
}

export interface PeerJSConnections {
  [key: string]: unknown;
}

export interface PeerJSError {
  type: 'browser-incompatible' | 'disconnected' | 'invalid-id' | 'invalid-key' | 'network' | 'peer-unavailable' | 'ssl-unavailable' | 'server-error' | 'socket-error' | 'socket-closed' | 'unavailable-id' | 'webrtc';
}

export interface PeerJSCallOptions {
  metadata: unknown;
  sdpTransform: () => void;
}

export interface PeerJSConnectOptions {
  label: string;
  metadata: unknown;
  serialization: 'binary' | 'binary-utf8' | 'json' | 'none';
  reliable: boolean;
}

export interface PeerJSDataConnect {
  send: (data: unknown) => void;
  close: () => void;
  on: (
    event: 'data' | 'open' | 'close' | 'error',
    callback: ((data: unknown) => void) | ((error: unknown) => void) | (() => void)
  ) => void;
  dataChannel: RTCDataChannel;
  label: string;
  metadata: unknown;
  open: boolean;
  peerConnectin: RTCPeerConnection;
  peer: string;
  reliable: boolean;
  serialization: 'binary' | 'binary-utf8' | 'json' | 'none';
  type: 'data';
  bufferSize: number;
}

export interface PeerJSMediaConnection {
  answer: (stream?: MediaStream, options?: { sdpTransform: () => void }) => void;
  close: () => void;
  on: ( (event: 'stream', callback: (stream: MediaStream) => void) => void )
    | ( (event: 'close', callback: () => void) => void )
    | ( (event: 'error', callback: (error: unknown) => void) => void );
  open: boolean;
  metadata: unknown;
  peer: string;
  type: 'media';
}






export interface RemoteDataPeersIds {
  type: 'peers_ids';
  payload: string[];
}

export function isRemoteData(value: unknown): value is RemoteDataPeersIds {
  const data = value as RemoteDataPeersIds;
  return (
    (data.type === 'peers_ids')
    && Array.isArray(data.payload)
    && data.payload.every(isPeerId)
  );
}

export function isPeerId(value: unknown): value is string {
  const id = value as string;
  return typeof id === 'string';
}
