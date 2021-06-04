import { IPeerId } from "../../App"

export interface IClientChatPageProps {
  peerId: IPeerId;
}

export const ClientChatPage: React.FC<IClientChatPageProps> = ({ peerId }) => {
  return (
    <div>Client Chat Page: { peerId }</div>
  );
}
