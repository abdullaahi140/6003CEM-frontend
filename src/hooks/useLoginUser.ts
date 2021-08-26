import { useHistory, useLocation } from 'react-router-dom';
import { useMutation, UseMutationResult } from 'react-query';

import { message } from 'antd';
import axios, { AxiosError } from 'axios';

import useAuthentication from './useAuthentication';
import { UserResponse } from '../react-app-env';

interface LocationState {
	from: {
		pathname: string
	}
}

interface Credentials {
	username: string;
	password: string
}

/**
 * Custom hook to login a user using a user password.
 * Redirects unauthenticated to login page and then
 * redirects back on successful authentication.
 * @returns {Object} - mutation object with data and status
 */
function useLoginUser(): UseMutationResult<UserResponse, AxiosError, Credentials> {
	const { login } = useAuthentication();
	const location = useLocation<LocationState>();
	const history = useHistory();
	const { from } = location.state || { from: { pathname: '/' } };

	/**
	 * Post the login request using values from the form
	 * */
	function loginUser({ username, password }: Credentials) {
		return axios('http://localhost:3000/api/v1/auth/login', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(`${username}:${password}`)}`,
			},
		})
			.then((response) => response.data);
	}

	const mutation = useMutation<UserResponse, AxiosError, Credentials>(
		loginUser, {
			onSuccess: (data) => {
				login(data);
				history.push(from.pathname);
			},
			onError: (error: AxiosError) => {
				console.error(error);
				message.error(error?.response?.data.message);
			},
		});

	return mutation;
}

export default useLoginUser;
