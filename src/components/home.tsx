import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { PageHeader } from 'antd';
import axios from 'axios';

import DogGrid from './doggrid';
import Page from './pagination';
import SearchBar from './search';

interface QueryParams {
	page: number;
	name: string;
	breed: string
}

/**
 * Home page component with list of paginated dogs and search
 */
function Home(): JSX.Element {
	const params = useParams<{ page: string }>();
	const initialPage = (parseInt(params.page, 10) > 1) ? parseInt(params.page, 10) : 1;
	const [page, setPage] = useState(initialPage);
	const [name, setName] = useState('');
	const [breed, setBreed] = useState('');
	const history = useHistory();

	/**
	 * Handles page change and dictates page number to Pagination component
	 * @param {Number} changePage - The page number to adjust pagination
	 */
	function handleChange(changePage: number) {
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
	function fetchDogs(param: QueryParams) {
		return axios(
			`${process.env.REACT_APP_API_URL}/api/v1/dogs?page=${param.page}&name=${param.name}&breed=${param.breed}`,
		)
			.then((response) => response.data)
			.catch((err) => console.error(err, 'Error fetching all dogs'));
	}

	const { data, isLoading, isSuccess } = useQuery(
		['dogs', { page, name, breed }],
		() => fetchDogs({ page, name, breed }),
	);

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
			{isSuccess && <DogGrid dogs={data?.dogs} loading={isLoading} />}
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
