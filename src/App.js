import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';
import { ReactQueryDevtools } from 'react-query/devtools';

import Nav from './components/nav.js';
import Home from './components/home.js';
import Register from './components/register.js';
import Login from './components/login.js';
import Favourite from './components/fav.js';
import Chat from './components/chat.js';
import Message from './components/message.js';
import DogForm from './components/dogform.js';
import DogView from './components/dogview.js';

import UserProvider from './providers/UserProvider.js';
import QueryProvider from './providers/QueryProvider.js';
import PrivateRoute from './HoC/private.js';
/**
 * App component that takes all the components and renders into a SPA
 */
function App() {
	return (
		<Router>
			<QueryProvider>
				<UserProvider>
					<Layout style={{ minHeight: '100vh' }}>
						<Layout.Header>
							<Nav />
						</Layout.Header>

						<Layout.Content style={{ padding: '2% 0% 1%', background: '#fff' }}>
							<Switch>
								<Route path="/register" component={Register} />
								<Route path="/login" component={Login} />
								<PrivateRoute path="/favourites" component={Favourite} />
								<PrivateRoute path="/chats" component={Chat} />
								<PrivateRoute path="/messages/:chatID" component={Message} />
								<PrivateRoute path="/dog_form/:dogID" component={DogForm} />
								<PrivateRoute path="/dog_form" component={DogForm} />
								<Route path="/dog/:dogID" component={DogView} />
								<Route path="/:page" component={Home} />
								<Route exact path="/" component={Home} />
							</Switch>
						</Layout.Content>

						<Layout.Footer style={{ textAlign: 'center' }}>Dog Shelter</Layout.Footer>
					</Layout>
					<ReactQueryDevtools />
				</UserProvider>
			</QueryProvider>
		</Router>
	);
}

export default App;
