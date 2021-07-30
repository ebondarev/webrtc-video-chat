import React from 'react';
import {
	BrowserRouter,
	Route, Switch
} from "react-router-dom";
import { Home } from './pages/Home';
import { Client } from './pages/Client';
import { Root } from "./pages/Root";
import { useAppSelector } from './hooks/useStore';
import { Popup } from './components/Popup';
import { UserNameField } from './components/UserNameField';

export const App: React.FC = () => {
	const userName = useAppSelector((state) => state.user.name);

	return (
		<>
			{userName && <BrowserRouter>
				<Switch>
					<Route path="/root">
						<Root />
					</Route>
					<Route path="/client">
						<Client />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</BrowserRouter>}

			{!userName && <Popup><UserNameField /></Popup>}
		</>
	);
}
