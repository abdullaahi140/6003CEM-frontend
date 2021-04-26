import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import UserContext from '../contexts/user.js';

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
	component: PropTypes.elementType.isRequired,
	location: PropTypes.object.isRequired
};

export default ProtectedRoute;
