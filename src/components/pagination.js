import React from 'react';
import { useQuery } from 'react-query';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';

/** Pagination component that controller which page of dogs to show. */
function Page(props) {
	const {
		page, name, breed, onChange
	} = props;

	/** Function that fetches the number of dogs depending on search terms */
	function fetchCount({ queryKey }) {
		const [_key, param] = queryKey;
		return axios(
			`http://localhost:3000/api/v1/dogs/count?name=${param.name}&breed=${param.breed}`
		)
			.then((response) => response.data)
			.catch((err) => console.error(err, 'Error fetching dog count'));
	}

	const { data } = useQuery(['dogCount', { name, breed }], fetchCount);

	return (
		<Pagination
			current={page} // defaultCurrent doesn't work hence the workaround
			total={data?.count}
			defaultPageSize={12}
			hideOnSinglePage
			showSizeChanger={false}
			onChange={onChange}
		/>
	);
}

Page.propTypes = {
	/** Name of the dog */
	name: PropTypes.string.isRequired,
	/** Breed of the dog */
	breed: PropTypes.string.isRequired,
	/** The current page of dogs */
	page: PropTypes.number.isRequired,
	/** onChange handler from parent component */
	onChange: PropTypes.func.isRequired
};

export default Page;
