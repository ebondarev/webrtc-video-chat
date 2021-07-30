import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/Button";

export function Home() {
	const history = useHistory();

	return (
		<Button onClick={() => history.push('/root')}>Create Root</Button>
	);
}
