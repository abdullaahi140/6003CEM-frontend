import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import PropTypes from 'prop-types';

/**
 * Custom react-query provider
 * @param {React.PropsWithChildren} children - arrays of descendants elements in component tree
 * @returns Context provider with instantiated react-query client
 */
function QueryProvider({ children }) {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}

QueryProvider.propTypes = {
	children: PropTypes.node.isRequired
};
export default QueryProvider;
