import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/user.js';

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleNav = this.handleNav.bind(this);
	}

	handleLogout() {
		const { user, logout } = this.context;
		fetch('http://localhost:3000/api/v1/auth/logout', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.catch((err) => console.error(err));
		logout();
	}

	handleNav() {
		const { loggedIn } = this.context;
		let loginNav;
		if (!loggedIn) {
			loginNav = (
				<>
					<Menu.Item key="3" style={{ float: 'right' }}>
						<Link to="/register">Register</Link>
					</Menu.Item>
					<Menu.Item key="4" style={{ float: 'right' }}>
						<Link to="/login">Login</Link>
					</Menu.Item>
				</>
			);
		} else {
			loginNav = (
				<Menu.Item key="3" onClick={this.handleLogout} style={{ float: 'right' }}>
					<Link to="/">Logout</Link>
				</Menu.Item>
			);
		}
		return loginNav;
	}

	render() {
		return (
			<Menu theme="dark" defaultSelectedKeys={['1']} mode="horizontal">
				<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
				<Menu.Item key="2"><Link to="/favourite">Favourites</Link></Menu.Item>
				{ this.handleNav()}
			</Menu>
		);
	}
}

Nav.contextType = UserContext;

export default Nav;
