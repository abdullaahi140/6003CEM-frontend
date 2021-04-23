import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = { count: 0 };
	}

	componentDidMount() {
		this.fetchCount();
	}

	componentDidUpdate(prevProps) {
		const { name, breed } = this.props;
		if (name !== prevProps.name || breed !== prevProps.breed) {
			this.fetchCount(name, breed);
		}
	}

	fetchCount(name = '', breed = '') {
		const { resource } = this.props;
		fetch(`http://localhost:3000/api/v1/${resource}/count?name=${name}&breed=${breed}`)
			.then(status)
			.then(json)
			.then((data) => {
				this.setState({ count: data.count });
			})
			.catch((err) => console.error(err, `Error fetching ${resource} count`));
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
	name: PropTypes.string.isRequired,
	breed: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	resource: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};

export default Page;
