import React from 'react';
import { withRouter } from 'react-router-dom';
import { PageHeader } from 'antd';
import PropTypes from 'prop-types';

import DogGrid from './doggrid.js';
import Page from './pagination.js';
import SearchBar from './search.js';

import { json, status } from '../utilities/requestHandlers.js';

class Home extends React.Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { page } = (match.params && match.params.page > 1) ? match.params : { page: 1 };
		this.state = {
			dogs: [],
			loading: true,
			page,
			name: '',
			breed: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.fetchDogs = this.fetchDogs.bind(this);
	}

	componentDidMount() {
		this.fetchDogs();
	}

	componentDidUpdate() {
		const { page, name, breed } = this.state;
		this.fetchDogs(page, name, breed);
	}

	handleChange(page) {
		const { history } = this.props;
		this.setState({ page });
		window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top
		history.push(`/${page}`);
	}

	handleSearch(value) {
		this.setState({ name: value });
	}

	handleSelect(value) {
		this.setState({ breed: value });
	}

	fetchDogs(page = 1, name = '', breed = '') {
		fetch(`http://localhost:3000/api/v1/dogs?page=${page}&name=${name}&breed=${breed}`)
			.then(status)
			.then(json)
			.then((data) => {
				this.setState({ dogs: data.dogs, loading: false });
			})
			.catch((err) => {
				this.setState({ dogs: [] });
				console.error(err, 'Error fetching dogs');
			});
	}

	render() {
		const {
			dogs, loading, name, breed, page
		} = this.state;
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
				<DogGrid dogs={dogs} loading={loading} updateParent={this.fetchDogs} />
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

Home.propTypes = {
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default withRouter(Home);
