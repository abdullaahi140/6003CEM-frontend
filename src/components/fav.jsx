import React from 'react';
import { PageHeader } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';
import useAuthentication from '../hooks/useAuthentication';
import DogGrid from './doggrid';

/**
 * Favourite component showing list of favourite dogs
 */
function Favourite() {
	const { state: { accessToken } } = useAuthentication();

	function fetchFavDogs() {
		return axios('http://localhost:3000/api/v1/dogs/favs', {
			headers: {
				Authorization: `Bearer ${accessToken.token}`
			}
		})
			.then((response) => response.data)
			.catch((err) => console.error(err, 'Error fetching favourite dogs'));
	}

	const { data, isLoading, isSuccess } = useQuery('favs', fetchFavDogs);

	return (
		<div className="site-layout-content">
			<div style={{ padding: '0% 10% 1%', textAlign: 'center' }}>
				<PageHeader
					style={{ padding: '0% 0% 1%' }}
					className="site-page-header"
					title="Favourite Dogs"
					subTitle="Browse through the list and adopt a dog."
				/>
			</div>
			{isSuccess && <DogGrid dogs={data} loading={isLoading} />}
		</div>
	);
}

export default Favourite;
