import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import DogCard from './dogcard.js';
import { status, json } from '../utilities/requestHandlers.js';

class DogGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dogs: [],
			loading: true
		};
	}

	componentDidMount() {
		this.fetchDogs();
	}

	componentDidUpdate(prevProps) {
		const { page, name, breed } = this.props;
		if (page !== prevProps.page
			|| name !== prevProps.name
			|| breed !== prevProps.breed
		) {
			this.fetchDogs(page, name, breed);
		}
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
		const { dogs, loading } = this.state;
		const cardList = dogs.map((dog) => (
			<div style={{ padding: '1em' }} key={dog.ID}>
				<Col span={6}>
					<DogCard {...dog} loading={loading} />
				</Col>
			</div>
		));
		return (
			<>
				<Row type="flex" justify="space-around">
					{cardList}
				</Row>
			</>
		);
	}
}

DogGrid.propTypes = {
	page: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	breed: PropTypes.string.isRequired
};

export default DogGrid;
