import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	Col, PageHeader, Row, Typography
} from 'antd';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';
import Image from './image.js';

/**
 * Dog details view component for user to get more info about a dog.
 */
class DogView extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { dog: {}, imageID: null };
	}

	/**
	 * Fetch dog using ID from URL parameter.
	 */
	componentDidMount() {
		const { match } = this.props;
		const { dogID } = match.params;
		fetch(`http://localhost:3000/api/v1/dogs/${dogID}`)
			.then(status)
			.then(json)
			.then((data) => this.setState({ dog: data, imageID: data.imageID }))
			.catch((err) => console.error(err));
	}

	render() {
		const { dog, imageID } = this.state;
		const { history } = this.props;
		return (
			<div style={{ padding: '0% 10% 1%', background: 'white' }}>
				<PageHeader
					className="site-page-header"
					title={`About ${dog.name}`}
					subTitle="Browse through the list and adopt a dog."
					onBack={() => history.goBack()}
				/>
				<Row>
					<Col span={12}>
						{(imageID) // check state has updated as 1st render is imageID = null
							&& <Image ID={imageID} alt={dog.breed} style={{ width: '550px' }} />}
					</Col>
					<Col span={12}>
						<Typography.Title level={4}>Name</Typography.Title>
						<p>{dog.name}</p>
						<Typography.Title level={4}>Age</Typography.Title>
						<p>{dog.age}</p>
						<Typography.Title level={4}>Gender</Typography.Title>
						<p>{dog.gender}</p>
						<Typography.Title level={4}>Breed</Typography.Title>
						<p>{dog.breed}</p>
						<Typography.Title level={4}>Description</Typography.Title>
						<p>{dog.description}</p>
					</Col>
				</Row>
			</div>
		);
	}
}

DogView.propTypes = {
	/** Object containing info on the URL including parameters */
	match: PropTypes.object.isRequired,
	/** Object containing the history of URLs for the app */
	history: PropTypes.object.isRequired
};

export default withRouter(DogView);
