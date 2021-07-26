import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import UserContext from '../contexts/user.js';

/**
 * Protects a route by checking the authenticated state before rendering a component
 * @param {React.Component} Component - The component that is being protected
 * @param {Object} rest - The component's props
 * @returns {Route} - A Route object that renders inline the component that was being protected
 */
function ProtectedRoute({ component: Component, ...rest }) {
	const context = useContext(UserContext);
	return (
		<Route
			{...rest}
			render={(renderProps) => (
				(context.loggedIn)
					? <Component {...renderProps} />
					: <Redirect to={{ pathname: '/login', state: { from: renderProps.location } }} />
			)}
		/>
	);
}

ProtectedRoute.propTypes = {
	/** The component that is being protected */
	component: PropTypes.func.isRequired
};

export default ProtectedRoute;
