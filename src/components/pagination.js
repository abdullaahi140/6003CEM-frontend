import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';

/** Pagination component that controller which page of dogs to show. */
class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = { count: 0 };
	}

	/** Initial render fetches count of dogs */
	componentDidMount() {
		this.fetchCount();
	}

	/** Update component when the current and previous props differ */
	componentDidUpdate(prevProps) {
		const { name, breed } = this.props;
		if (name !== prevProps.name || breed !== prevProps.breed) {
			this.fetchCount(name, breed);
		}
	}

	/** Function that fetches the number of dogs depending on search terms */
	fetchCount(name = '', breed = '') {
		fetch(`https://source-modem-3000.codio-box.uk/api/v1/dogs/count?name=${name}&breed=${breed}`)
			.then(status)
			.then(json)
			.then((data) => {
				this.setState({ count: data.count });
			})
			.catch((err) => console.error(err, 'Error fetching dog count'));
	}

	render() {
		const { count } = this.state;
		const { page, onChange } = this.props;
		return (
			<Pagination
				current={page} // defaultCurrent doesn't work hence the workaround
				total={count}
				defaultPageSize={12}
				hideOnSinglePage
				showSizeChanger={false}
				onChange={onChange}
			/>
		);
	}
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
