import React, { useReducer, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { message } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import UserContext from '../contexts/user';
import userReducer from '../reducers/userReducer';
import useLogoutCookies from '../hooks/useLogoutCookies';

/**
 * Custom user provider with user details
 * @param {React.PropsWithChildren} children - arrays of descendants elements in component tree
 * @returns Context provider with state and dispatch function
 */
function UserProvider({ children }) {
	const [cookies, setCookie, removeCookie] = useCookies(['user', 'accessToken', 'refreshToken']);
	const initialState = {
		user: cookies.user || null,
		loggedIn: Boolean(cookies.accessToken),
		accessToken: cookies.accessToken || null,
		refreshToken: cookies.refreshToken || null
	};

	const [state, dispatch] = useReducer(userReducer, initialState);
	const value = useMemo(() => [state, dispatch], [state]);

	const { logout } = useLogoutCookies(dispatch);
	const refreshAccessToken = (async () => {
		try {
			const { data } = await axios.get(`http://localhost:3000/api/v1/auth/refresh/${state.user.ID}`);
			removeCookie('accessToken');
			setCookie('accessToken', data.accessToken, {
				path: '/',
				maxAge: data.accessToken.expiresIn
			});
			dispatch({ type: 'REFRESH_ACCESS_TOKEN', payload: data });
		} catch (error) {
			console.error(error, 'Error fetching new access token');
			logout();
			message.error('Session expired, please log in again', 5);
		}
	});

	const queryClient = useQueryClient();
	const retry = function retry(error) {
		if (error.response.status === 401 && error.response.data.name === 'TokenExpiredError') {
			refreshAccessToken();
			queryClient.cancelQueries();
		}
		return 3;
	};

	queryClient.setDefaultOptions({
		queries: {
			retry: (_failureCount, error) => {
				console.error(error.response);
				retry(error);
			}
		},
		mutations: {
			retry: (_failureCount, error) => {
				console.error(error.response);
				retry(error);
			}
		}
	});

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
}

UserProvider.propTypes = {
	children: PropTypes.node.isRequired
};
export default UserProvider;
