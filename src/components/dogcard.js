import React from 'react';
import { Card } from 'antd';
import { json, status } from '../utilities/requestHandlers';
import PropTypes from 'prop-types';

class DogCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: null
		}
	}

	componentDidMount() {
		fetch(`http://localhost:3000/api/v1/images/${this.props.imageID}`)
			.then(status)
			.then(res => json(res, true))
			.then(data => {
				this.setState({ image: URL.createObjectURL(data) });
			})
			.catch(err => console.log(err, "Error fetching image"));
	}

	render() {
		const { Meta } = Card;
		return (
			<Card
				style={{ width: 320 }}
				hoverable={true}
				loading={this.props.loading}
				actions={[
					<p key={this.props.ID}>Age: {this.props.age}</p>,
					<p key={this.props.ID}>Breed: {this.props.breed}</p>
				]}
				cover={
					<img src={this.state.image} style={{ width: "320px", height: "180px", objectFit:"cover"}} />
				}
			>
				<Meta title={this.props.name} description={`${this.props.locationName} Shelter`} />
			</Card>
		);
	}
}

DogCard.propTypes = {
	ID: PropTypes.number,
	name: PropTypes.string,
	age: PropTypes.number,
	breed: PropTypes.string,
	locationName: PropTypes.string,
	imageID: PropTypes.number,
	loading: PropTypes.bool
};

export default DogCard;
