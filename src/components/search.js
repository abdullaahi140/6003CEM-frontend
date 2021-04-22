import React from 'react';
import { Input, Select } from "antd";
import PropTypes from "prop-types";
import { json, status } from '../utilities/requestHandlers';


class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { breeds: [] };
	}

	componentDidMount() {
		fetch('http://localhost:3000/api/v1/dogs/breeds')
			.then(status)
			.then(json)
			.then(data => {
				this.setState({ breeds: data });
			})
			.catch(err => console.log(err, "Error fetching breeds"));
	}

	render() {
		const { Search } = Input;
		const { Option } = Select
		const breedOptions = this.state.breeds.map((breed, index) => {
			return (
				<Option key={index} value={breed}>{breed}</Option>
			)
		});
		const selectAfter = <Select
			style={{ width: 140 }}
			allowClear
			placeholder="Filter by breed"
			onChange={this.props.onSelect}

		>
			{breedOptions}
		</Select>;
		return (
			<Search placeholder="Search dogs..."
				allowClear
				size="large"
				addonBefore={selectAfter}
				enterButton="Search"
				onSearch={this.props.onSearch} />
		)
	}
}

SearchBar.propTypes = {
	onSearch: PropTypes.func,
	onSelect: PropTypes.func
}

export default SearchBar;