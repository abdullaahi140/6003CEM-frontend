import React from 'react';
import { Col, Row } from 'antd';
import DogCard from './dogcard.js';
import { status, json } from '../utilities/requestHandlers.js';
import PropTypes from "prop-types";

class DogGrid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dogs: [],
			loading: true
		}
	}

	componentDidMount() {
		this.fetchDogs();
	}

	componentDidUpdate(prevProps) {
		if (this.props.page != prevProps.page
			|| this.props.name != prevProps.name
			|| this.props.breed != prevProps.breed
		) {
			this.fetchDogs(this.props.page, this.props.name, this.props.breed)
		}
	}

	fetchDogs(page = 1, name = '', breed = '') {
		fetch(`http://localhost:3000/api/v1/dogs?page=${page}&name=${name}&breed=${breed}`)
			.then(status)
			.then(json)
			.then(data => {
				this.setState({ dogs: data.dogs, loading: false })
			})
			.catch((err) => {
				this.setState({ dogs: [] });
				console.log(err, "Error fetching dogs");
			})
	}

	render() {
		const cardList = this.state.dogs.map(dog => {
			return (
				<div style={{ padding: "1em" }} key={dog.ID}>
					<Col span={6}>
						<DogCard {...dog} loading={this.state.loading} />
					</Col>
				</div>
			)
		});
		return (
			<>
				<Row type="flex" justify="space-around">
					{cardList}
				</Row>
			</>
		)
	}
}

DogGrid.propTypes = {
	page: PropTypes.number,
	name: PropTypes.string,
	breed: PropTypes.string
}

export default DogGrid;
