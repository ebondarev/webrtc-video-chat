import React from 'react';

export function useLocalMediaStream() {
	const [stream, setStream] = React.useState<MediaStream>();

	React.useEffect(() => {
		(async () => {
			const constraints = {
				audio: {
					echoCancellation: true,
				},
				video: {
					width: 270,
					facingMode: 'user',
				},
			};
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			setStream(stream);
		})();
	}, []);

	return stream;
}
