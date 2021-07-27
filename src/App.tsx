import React from 'react';
import {
	BrowserRouter,
	Route, Switch
} from "react-router-dom";
import { Home } from './pages/Home';
import { Client } from './pages/Client';
import { Root } from "./pages/Root";
import { Popup } from "./components/Popup";
import { WaitingList } from "./components/WaitingList";
import { store } from './store';
import { Provider } from 'react-redux';

export const App: React.FC = () => {
	const [isShowWaitingListPopup, setIsShowWaitingListPopup] = React.useState(false);

	return (
		<Provider store={store}>
			<BrowserRouter>
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
			</BrowserRouter>

			<Popup isShow={ isShowWaitingListPopup }>
				{isShowWaitingListPopup && <WaitingList />}
			</Popup>
		</Provider>
	);
}
