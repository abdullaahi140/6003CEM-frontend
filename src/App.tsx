import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';

import Nav from './components/nav';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Favourite from './components/fav';
import Chat from './components/chat';
import Message from './components/message';
import DogForm from './components/dogform';
import DogView from './components/dogview';

import UserProvider from './providers/UserProvider';
import QueryProvider from './providers/QueryProvider';
import PrivateRoute from './HoC/private';

/**
 * App component that takes all the components and renders into a SPA
 */
function App(): JSX.Element {
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
				</UserProvider>
			</QueryProvider>
		</Router>
	);
}

export default App;
