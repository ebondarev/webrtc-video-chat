import React from "react";
import { Button } from "../../components/Button";
import s from './style.module.css';

export function Root() {
	return (
		<div className={s['video-messanger-container']}>
			<div className={s['toggle-waiting-list']}>
				<Button onClick={() => { }}>Waiting list</Button>
			</div>

			<section className={s['video-container']}>
				<div className={s['users-video']}></div>
				<div className={s['main-video']}>
					<div className={`${s['icon']} ${s['main-video__volume']}`}>
						<svg height="24" viewBox="0 0 24 24" width="24"><polygon fill="none" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" /></svg>
						<input type="range" />
					</div>
				</div>
			</section>

			<aside className={s['aside']}>
				<div className={s['chat']}>
					<div className={s['chat-info']}>
						<div className={s['chat-info__title']}>Party Chat</div>
						<div className={s['chat-info__participants']}><span>1</span> Participants</div>
					</div>
					<div className={s['chat-messages-container']}>
						<div className={s['chat-messages']}></div>
					</div>
					<div className={s['chat-textarea']}>
						<textarea className={s['chat-textarea__input-area']}></textarea>
					</div>
				</div>
			</aside>

			<footer className={s['footer']}>
				<div className={`${s['icon']} ${s['icon__camera']}`}>
					<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z" />
					</svg>
				</div>
				<div className={`${s['icon']} ${s['icon__microphone']}`}>
					<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
						<path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
					</svg>
				</div>
				<div className={`${s['icon']} ${s['icon__call-end']}`}>
					<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
					</svg>
				</div>
			</footer>
		</div>
	);
}
