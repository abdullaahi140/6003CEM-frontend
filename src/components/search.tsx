import React from 'react';
import { Input, Select } from 'antd';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import axios from 'axios';

interface Props {
	onSearch: (value: string) => void;
	onSelect: (value: string) => void;
}

/**
 * Search component that updates the list of dogs shown.
 */
function SearchBar(props: Props): JSX.Element {
	const { Search } = Input;
	const { Option } = Select;
	const { onSelect, onSearch } = props;

	/**
	 * Fetch the list of breeds of dogs currently in a shelter.
	 */
	function fetchBreeds() {
		return axios(`${process.env.REACT_APP_API_URL}/api/v1/dogs/breeds`)
			.then((response) => response.data)
			.catch((err) => console.error(err, 'Error fetching breeds'));
	}

	const { data, isSuccess } = useQuery('breeds', fetchBreeds);

	const breedOptions = isSuccess && data.map((breed: string, index: number) => (
		// eslint-disable-next-line react/no-array-index-key
		<Option key={index} value={breed}>{breed}</Option>
	));

	const selectAfter = (
		<Select
			style={{ width: 140 }}
			allowClear
			placeholder="Filter by breed"
			onChange={onSelect}
		>
			{breedOptions}
		</Select>
	);
	return (
		<Search
			placeholder="Search dogs..."
			allowClear
			size="large"
			addonBefore={selectAfter}
			enterButton="Search"
			onSearch={onSearch}
		/>
	);
}

SearchBar.propTypes = {
	/** Function to update dogs depending on the value in Input */
	onSearch: PropTypes.func.isRequired,
	/** Function to update dogs depending on the value in Select */
	onSelect: PropTypes.func.isRequired,
};

export default SearchBar;
