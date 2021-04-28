import React from 'react';
import { withRouter } from 'react-router-dom';
import { PageHeader } from 'antd';
import PropTypes from 'prop-types';

import DogGrid from './doggrid.js';
import Page from './pagination.js';
import SearchBar from './search.js';

import { json, status } from '../utilities/requestHandlers.js';

/**
 * Home page component with list of paginated dogs and search
 */
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

	/** Fetch dogs on initial render */
	componentDidMount() {
		this.fetchDogs();
	}

	/** Updates list of dogs depending if search terms or page has changed */
	componentDidUpdate() {
		const { page, name, breed } = this.state;
		this.fetchDogs(page, name, breed);
	}

	/** Handles page change and dictates page number to Pagination component */
	handleChange(page) {
		const { history } = this.props;
		this.setState({ page });
		window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top
		history.push(`/${page}`);
	}

	/** Sets search state depending on value in search */
	handleSearch(value) {
		this.setState({ name: value });
	}

	/** Sets breed value depending on value in Select component */
	handleSelect(value) {
		this.setState({ breed: value });
	}

	/**
	 * Fetches dogs matching search terms
	 * @param {number} page - The current page
	 * @param {number} name - The name of the dog
	 * @param {number} breed - The breed of the dog
	 */
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
	/** Object containing info on the URL including parameters */
	match: PropTypes.object.isRequired,
	/** Object containing the history of URLs for the app */
	history: PropTypes.object.isRequired
};

export default withRouter(Home);
