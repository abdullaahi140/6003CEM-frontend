import React from 'react';
import { Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { breeds: [] };
	}

	componentDidMount() {
		fetch('http://localhost:3000/api/v1/dogs/breeds')
			.then(status)
			.then(json)
			.then((data) => {
				this.setState({ breeds: data });
			})
			.catch((err) => console.error(err, 'Error fetching breeds'));
	}

	render() {
		const { Search } = Input;
		const { Option } = Select;
		const { breeds } = this.state;
		const { onSelect, onSearch } = this.props;
		const breedOptions = breeds.map((breed, index) => (
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
}

SearchBar.propTypes = {
	onSearch: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired
};

export default SearchBar;
