import { Dispatch } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import { Action } from '../react-app-env';

/**
 * Custom hook to provide logout functionality for the application
 * @returns {Object} logout function that removes cookies and redirects application
 */
function useLogoutCookies(dispatch: Dispatch<Action>): { logout: () => void } {
	const [_cookies, _setCookie, removeCookie] = useCookies(['user', 'accessToken', 'refreshToken']);
	const history = useHistory();

	const logout = (() => {
		removeCookie('user');
		removeCookie('accessToken');
		removeCookie('refreshToken');
		history.push('/');
		dispatch({ type: 'LOGOUT' });
	});

	return { logout };
}

export default useLogoutCookies;
