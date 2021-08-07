import { useHistory, useLocation } from 'react-router-dom';
import { useMutation } from 'react-query';

import { message } from 'antd';
import axios from 'axios';

import useAuthentication from './useAuthentication.js';

/**
 * Custom hook to login a user using a user password.
 * @returns {Object} - mutation object with data and status
 */
function useLoginUser() {
	const { login } = useAuthentication();
	const location = useLocation();
	const history = useHistory();
	const { from } = location.state || { from: { pathname: '/' } };
	/**
	 * Post the login request using values from the form
	 * */
	function loginUser({ username, password }) {
		return axios('http://localhost:3000/api/v1/auth/login', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(`${username}:${password}`)}`
			}
		})
			.then((response) => response.data);
	}

	const mutation = useMutation(loginUser, {
		onSuccess: (data) => {
			login(data);
			history.push(from.pathname);
		},
		onError: (error) => {
			console.error(error);
			message.error(error.response.data.message);
		}
	});

	return mutation;
}

export default useLoginUser;
