import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import './App.css';

import Nav from './components/nav.js';
import Home from './components/home.js';
import Register from './components/register.js';
import Login from './components/login.js';
import Favourite from './components/fav.js';
import Chat from './components/chat.js';
import Message from './components/message.js';
import DogForm from './components/dogform.js';
import DogView from './components/dogview.js';

import PrivateRoute from './HoC/private.js';
import UserContext from './contexts/user.js';

import { json, status } from './utilities/requestHandlers.js';

/**
 * App component that takes all the components and renders into a SPA
 */
class App extends React.Component {
	constructor(props) {
		super(props);
		const { cookies } = this.props;
		this.state = {
			user: cookies.get('user') || null,
			loggedIn: Boolean(cookies.get('accessToken')),
			accessToken: cookies.get('accessToken') || null,
			refreshToken: cookies.get('refreshToken') || null
		};
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.fetchRefresh = this.fetchRefresh.bind(this);
	}

	/**
	 * Checks if the accessToken cookie is undefined and refreshes it
	 */
	componentDidMount() {
		const { user, accessToken, refreshToken } = this.state;
		if (user && refreshToken && !accessToken) {
			this.fetchRefresh();
		}
	}

	/**
	 * Adds the authenticated user to state which updates the user contextz
	 * @param {Object} user - The user object containing the authenticated users details.
	 */
	login(user) {
		const { cookies } = this.props;
		cookies.set('user', user, {
			path: '/',
			maxAge: user.refreshToken.expiresIn
		});
		cookies.set('accessToken', user.accessToken.token, {
			path: '/',
			maxAge: user.accessToken.expiresIn
		});
		cookies.set('refreshToken', user.refreshToken.token, {
			path: '/',
			maxAge: user.refreshToken.expiresIn
		});
		this.setState({ user, loggedIn: true });
	}

	/**
	 * Logs the user out and resets the state which also resets the user context
	 */
	logout() {
		const { cookies } = this.props;
		cookies.remove('user');
		cookies.remove('accessToken');
		cookies.remove('refreshToken');
		this.setState({ user: null, loggedIn: false });
	}

	/**
	 * Fetch a new access token from the API if the access token has expired
	 */
	fetchRefresh() {
		const { cookies } = this.props;
		const { user } = this.state;
		fetch(`http://localhost:3000/api/v1/auth/refresh/${user.user.ID}`)
			.then(status)
			.then(json)
			.then((data) => {
				cookies.set('accessToken', data.accessToken.token, {
					path: '/',
					maxAge: data.accessToken.expiresIn
				});
				this.setState({ accessToken: cookies.get('accessToken') });
				this.login(user);
			})
			.catch((err) => console.error(err));
	}

	render() {
		const context = {
			...this.state,
			login: this.login,
			logout: this.logout
		};

		return (
			<UserContext.Provider value={context}>
				<Router>
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
						<Layout.Footer style={{ textAlign: 'center' }}>6003 CEM CW2</Layout.Footer>
					</Layout>
				</Router>
			</UserContext.Provider>
		);
	}
}

App.propTypes = {
	/** Cookies object allowing for cookie creation and deletion */
	cookies: PropTypes.instanceOf(Cookies).isRequired
};

export default withCookies(App);
