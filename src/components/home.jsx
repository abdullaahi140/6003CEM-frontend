import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { PageHeader } from 'antd';
import axios from 'axios';

import DogGrid from './doggrid';
import Page from './pagination';
import SearchBar from './search';

/**
 * Home page component with list of paginated dogs and search
 */
function Home() {
	const params = useParams();
	const [page, setPage] = useState((params.page > 1) ? params.page : 1);
	const [name, setName] = useState('');
	const [breed, setBreed] = useState('');
	const history = useHistory();

	/**
	 * Handles page change and dictates page number to Pagination component
	 * @param {Number} changePage - The page number to adjust pagination
	 */
	function handleChange(changePage) {
		setPage(changePage);
		window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top
		history.push(`/${changePage}`);
	}

	/**
	 * Fetches dogs matching search terms
	 * @param {number} page - The current page
	 * @param {number} name - The name of the dog
	 * @param {number} breed - The breed of the dog
	 */
	function fetchDogs({ queryKey }) {
		const [_key, param] = queryKey;
		return axios(
			`http://localhost:3000/api/v1/dogs?page=${param.page}&name=${param.name}&breed=${param.breed}`
		)
			.then((response) => response.data)
			.catch((err) => console.error(err, 'Error fetching all dogs'));
	}

	const { data, isLoading, isSuccess } = useQuery(['dogs', { page, name, breed }], fetchDogs);

	return (
		<div className="site-layout-content">
			<div style={{ padding: '0% 10% 1%', textAlign: 'center' }}>
				<PageHeader
					style={{ padding: '0% 0% 1%' }}
					className="site-page-header"
					title="Charity Dogs"
					subTitle="Browse through the list and adopt a dog."
				/>
				<SearchBar
					onSearch={(value) => setName(value)}
					onSelect={(value = '') => setBreed(value)}
				/>
			</div>
			{isSuccess && <DogGrid dogs={data?.dogs} loading={isLoading} updateParent={fetchDogs} />}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Page
					name={name}
					breed={breed}
					page={page}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
}

export default Home;
