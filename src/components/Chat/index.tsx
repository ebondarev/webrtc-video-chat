import React from "react";
import { useHistory } from "react-router";
import { Messanger } from "../Messanger";
import { Participants } from "../Participants";
import s from './index.module.css';
import { AppContext } from "../../App";
import { Footer } from "../Footer";


export interface IChatProps { }

export const Chat: React.FC<IChatProps> = () => {
  const history = useHistory();
  const { localPeerId } = React.useContext(AppContext);
 
  const [ isTalking, setIsTalking ] = React.useState<boolean>(false);

  if (localPeerId === '') {
    history.push('/');
  }

  return (
    <>
      <section className={ s['content'] }>
        <main>
          <Participants />
          {/* <VideoPlayer { ...videoPlayerOptions } /> */}
        </main>
        <aside className={ s['aside'] }>
          <Messanger />
        </aside>
      </section>

      <section>
        <Footer isTalking={ isTalking } />
      </section>
    </>
  );
}
