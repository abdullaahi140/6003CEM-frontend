import React from 'react';
import { Menu, message } from 'antd';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import useAuthentication from '../hooks/useAuthentication';
import { LogoutResponse } from '../react-app-env';

/**
 * Nav component that conditionally renders links depending on authentication
 * state and user role.
 */
function Nav(): JSX.Element {
	const { state, logout } = useAuthentication();

	/**
	 * Post request to API when user logs out
	 */
	function handleLogout(): Promise<LogoutResponse> {
		return axios(`${process.env.REACT_APP_API_URL}/api/v1/auth/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${state?.accessToken?.token}`,
			},
		})
			.then((response) => response.data);
	}

	const { mutate } = useMutation<LogoutResponse, AxiosError>(
		handleLogout, {
			onSuccess: () => {
				logout();
				message.success('Successfully logged out');
			},
			onError: (error) => {
				console.error(error.response?.config.method);
			},
		});

	/**
	 * Function that adds links to the nav depending on authentication state
	 * and user role.
	 * @returns {Menu.Item} - The links to render in the nav bar
	 */
	function handleNav() {
		const { user, loggedIn } = state;
		let dogNav;
		let loginNav;

		try {
			if (user?.role !== 'user') {
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
				<Menu.Item key="5" onClick={() => mutate()} style={{ float: 'right' }}>
					Logout
				</Menu.Item>
			);
		}
		return [dogNav, loginNav];
	}

	return (
		<Menu theme="dark" defaultSelectedKeys={['1']} mode="horizontal">
			<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
			<Menu.Item key="2"><Link to="/favourites">Favourites</Link></Menu.Item>
			<Menu.Item key="3"><Link to="/chats">Contact a Shelter</Link></Menu.Item>
			{handleNav()}
		</Menu>
	);
}

export default Nav;
