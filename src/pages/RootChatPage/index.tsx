import { IPeerId } from "../../App";

export interface IRootChatPage {
  peerId: IPeerId;
}

export const RootChatPage: React.FC<IRootChatPage> = ({ peerId }) => {
  return (
    <div>Root Chat Page: { peerId }</div>
  );
}
