import { IPeerId } from "../App";

export interface RemoteData {
  type: 'peers_ids';
  payload: IPeerId[];
}