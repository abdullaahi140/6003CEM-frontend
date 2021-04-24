import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) => (
			(rest.loggedIn)
				? <Component {...props} />
				: <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
		)}
	/>
);

ProtectedRoute.propTypes = {
	component: PropTypes.elementType.isRequired,
	location: PropTypes.object.isRequired,
	loggedIn: PropTypes.bool.isRequired
};

export default ProtectedRoute;
