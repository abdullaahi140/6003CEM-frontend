import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import Nav from './components/nav.js';
import Home from './components/home.js';
import Register from './components/register.js';
import Login from './components/login.js';
import Favourite from './components/fav.js';
import Chat from './components/chat.js';
import Message from './components/message.js';

import PrivateRoute from './HoC/private.js';
import UserContext from './contexts/user.js';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { user: null, loggedIn: false };
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	login(user) {
		this.setState({ user, loggedIn: true });
	}

	logout() {
		this.setState({ user: null, loggedIn: false });
	}

	render() {
		const { user, loggedIn } = this.state;
		const context = {
			user,
			login: this.login,
			logout: this.logout,
			loggedIn
		};

		return (
			<UserContext.Provider value={context}>
				<Router>
					<Layout style={{ minHeight: '100vh' }}>
						<Header>
							<Nav />
						</Header>

						<Content style={{ padding: '2% 0% 1%', background: '#fff' }}>
							<Switch>
								<Route path="/register" component={Register} />
								<Route path="/login" component={Login} />
								<PrivateRoute path="/favourites" component={Favourite} />
								<PrivateRoute path="/chats" component={Chat} />
								<PrivateRoute path="/messages/:chatID" component={Message} />
								<Route exact path="/" component={Home} />
							</Switch>
						</Content>
						<Footer style={{ textAlign: 'center' }}>6003 CEM CW2</Footer>
					</Layout>
				</Router>
			</UserContext.Provider>
		);
	}
}

export default App;

// TODO: Messaging
// TODO: Account page
// TODO: Staff add and remove dogs
