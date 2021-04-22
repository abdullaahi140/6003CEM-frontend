import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers';

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = { count: 0 }
	}

	fetchCount(name = '', breed = '') {
		fetch(`http://localhost:3000/api/v1/${this.props.resource}/count?name=${name}&breed=${breed}`)
			.then(status)
			.then(json)
			.then(data => {
				this.setState({ count: data.count });
			})
			.catch(err => console.log(err, `Error fetching ${this.props.resource} count`));
	}

	componentDidMount() {
		this.fetchCount();
	}

	componentDidUpdate(prevProps) {
		if (this.props.name != prevProps.name || this.props.breed != prevProps.breed) {
			this.fetchCount(this.props.name, this.props.breed)
		}
	}

	render() {
		return (
			<Pagination
				current={this.props.page} // defaultCurrent doesn't work hence the workaround
				total={this.state.count}
				defaultPageSize={12}
				hideOnSinglePage={true}
				showSizeChanger={false}
				onChange={this.props.onChange}
			/>
		)
	}
}

Page.propTypes = {
	name: PropTypes.string,
	breed: PropTypes.string,
	page: PropTypes.number,
	resource: PropTypes.string,
	onChange: PropTypes.func
}

export default Page
