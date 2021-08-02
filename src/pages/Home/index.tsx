import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/Button";

export function Home() {
	const history = useHistory();
	const buttonRef = React.useRef<HTMLButtonElement>(null);

	React.useEffect(() => {
		buttonRef.current?.focus();
	}, []);

	return (
		<Button onClick={() => history.push('/root')} ref={buttonRef}>Create Root</Button>
	);
}
