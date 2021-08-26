import React, { useReducer } from 'react';
import { useQueryClient } from 'react-query';
import { useCookies } from 'react-cookie';
import { message } from 'antd';
import PropTypes from 'prop-types';
import axios, { AxiosError } from 'axios';
import UserContext from '../contexts/user';
import userReducer from '../reducers/userReducer';
import useLogoutCookies from '../hooks/useLogoutCookies';

/**
 * Custom user provider with user details
 * @param {React.PropsWithChildren} children - arrays of descendants elements in component tree
 * @returns Context provider with state and dispatch function
 */
function UserProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const [cookies, setCookie, removeCookie] = useCookies(['user', 'accessToken', 'refreshToken']);
	const initialState = {
		user: cookies.user || null,
		loggedIn: Boolean(cookies.accessToken),
		accessToken: cookies.accessToken || null,
		refreshToken: cookies.refreshToken || null,
	};

	const [state, dispatch] = useReducer(userReducer, initialState);
	const value = { state, dispatch };

	const { logout } = useLogoutCookies(dispatch);
	const refreshAccessToken = (async () => {
		try {
			const { data } = await axios.get(`http://localhost:3000/api/v1/auth/refresh/${state?.user?.ID}`);
			removeCookie('accessToken');
			setCookie('accessToken', data.accessToken, {
				path: '/',
				maxAge: data.accessToken.expiresIn,
			});
			dispatch({ type: 'REFRESH_ACCESS_TOKEN', payload: data });
		} catch (error) {
			console.error(error, 'Error fetching new access token');
			logout();
			message.error('Session expired, please log in again', 5);
		}
	});

	const queryClient = useQueryClient();
	const retry = function retry(failureCount: number, error: AxiosError) {
		console.error(error.response);
		if (error?.response?.status === 401 && error.response.data.name === 'TokenExpiredError') {
			refreshAccessToken();
			queryClient.cancelQueries();
			return true;
		}
		if (failureCount < 2) return true;
		return false;
	};

	queryClient.setDefaultOptions({
		queries: {
			retry: (failureCount, error) => {
				return retry(failureCount, error as AxiosError);
			},
		},
		mutations: {
			retry: (failureCount, error) => {
				return retry(failureCount, error as AxiosError);
			},
		},
	});

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
}

UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
export default UserProvider;
