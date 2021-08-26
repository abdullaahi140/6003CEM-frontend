import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import useAuthentication from '../hooks/useAuthentication';

interface Props {
	component: React.ElementType;
	path: string
}

/**
 * Protects a route by checking the authenticated state before rendering a component
 * @param {React.Component} Component - The component that is being protected
 * @param {Object} rest - The component's props
 * @returns {Route} - A Route object that renders inline the component that was being protected
 */
function ProtectedRoute({ component: Component, path }: Props): JSX.Element {
	const { state: { loggedIn } } = useAuthentication();
	return (
		<Route
			path={path}
			render={(renderProps) => (
				(loggedIn)
					? <Component {...renderProps} />
					: <Redirect to={{ pathname: '/login', state: { from: renderProps.location } }} />
			)}
		/>
	);
}

ProtectedRoute.propTypes = {
	/** The component that is being protected */
	component: PropTypes.func.isRequired,
	/** The path to redirect to */
	path: PropTypes.string.isRequired,
};

export default ProtectedRoute;
