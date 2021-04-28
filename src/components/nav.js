import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/user.js';

/**
 * Nav component that conditionally renders links depending on authentication
 * state and user role.
 */
class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleNav = this.handleNav.bind(this);
	}

	/**
	 * Post request to API when user logs out
	 */
	handleLogout() {
		const { user, logout } = this.context;
		fetch('http://localhost:3000/api/v1/auth/logout', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${user.accessToken.token}`
			}
		})
			.catch((err) => console.error(err));
		logout();
	}

	/**
	 * Function that adds links to the nav depending on authentication state
	 * and user role.
	 * @returns {Menu.Item} - The links to render in the nav bar
	 */
	handleNav() {
		const { loggedIn, user } = this.context;
		let dogNav;
		let loginNav;

		try {
			if (user.user.role !== 'user') {
				dogNav = (
					<Menu.Item key="4">
						<Link to="/dog_form">Add a dog</Link>
					</Menu.Item>
				);
			}
		} catch (err) {
			if (err instanceof TypeError) {
				// pass;
			} else {
				throw err;
			}
		}

		if (!loggedIn) {
			loginNav = (
				<>
					<Menu.Item key="5" style={{ float: 'right' }}>
						<Link to="/register">Register</Link>
					</Menu.Item>
					<Menu.Item key="6" style={{ float: 'right' }}>
						<Link to="/login">Login</Link>
					</Menu.Item>
				</>
			);
		} else {
			loginNav = (
				<Menu.Item key="5" onClick={this.handleLogout} style={{ float: 'right' }}>
					<Link to="/">Logout</Link>
				</Menu.Item>
			);
		}
		return [dogNav, loginNav];
	}

	render() {
		return (
			<Menu theme="dark" defaultSelectedKeys={['1']} mode="horizontal">
				<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
				<Menu.Item key="2"><Link to="/favourites">Favourites</Link></Menu.Item>
				<Menu.Item key="3"><Link to="/chats">Contact a Shelter</Link></Menu.Item>
				{ this.handleNav()}
			</Menu>
		);
	}
}

Nav.contextType = UserContext;

export default Nav;
