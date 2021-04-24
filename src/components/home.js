import React from 'react';
import { PageHeader } from 'antd';

import DogGrid from './doggrid.js';
import Page from './pagination.js';
import SearchBar from './search.js';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			name: '',
			breed: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
	}

	handleChange(page) {
		this.setState({ page });
		window.scrollTo(0, 0);
	}

	handleSearch(value) {
		this.setState({ name: value });
	}

	handleSelect(value) {
		this.setState({ breed: value });
	}

	render() {
		const { name, breed, page } = this.state;
		return (
			<div className="site-layout-content">
				<div style={{ padding: '0% 10% 1%', textAlign: 'center' }}>
					<PageHeader
						style={{ padding: '0% 0% 1%' }}
						className="site-page-header"
						title="Charity Dogs"
						subTitle="Browse through the list and adopt a dog."
					/>
					<SearchBar onSearch={this.handleSearch} onSelect={this.handleSelect} />
				</div>
				<DogGrid {...this.state} />
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Page
						resource="dogs"
						onChange={this.handleChange}
						name={name}
						breed={breed}
						page={page}
					/>
				</div>
			</div>
		);
	}
}

export default Home;
