import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/Button";
import { Popup } from "../../components/Popup";
import { UserNameField } from "../../components/UserNameField";
import { RootState } from "../../store";

export function Home() {
	const userName = useSelector((state: RootState) => state.user.name);
	const history = useHistory();

	return (
		<>
			{(userName !== '') && <Button onClick={() => history.push('/root')}>Create Root</Button>}

			<Popup isShow={userName === ''}>
				<UserNameField />
			</Popup>
		</>
	);
}
