import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';

class DogCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: null
		};
	}

	componentDidMount() {
		const { imageID } = this.props;
		fetch(`http://localhost:3000/api/v1/images/${imageID}`)
			.then(status)
			.then((res) => json(res, true))
			.then((data) => {
				this.setState({ image: URL.createObjectURL(data) });
			})
			.catch((err) => console.error(err, 'Error fetching image'));
	}

	render() {
		const { Meta } = Card;
		const { image } = this.state;
		const {
			loading, ID, age, breed, name, locationName, description
		} = this.props;
		return (
			<Card
				style={{ width: 320 }}
				hoverable
				loading={loading}
				actions={[
					<p key={ID}>
						Age:
						{age}
					</p>,
					<p key={ID}>
						Breed:
						{breed}
					</p>
				]}
				cover={
					<img src={image} alt={description} style={{ width: '320px', height: '180px', objectFit: 'cover' }} />
				}
			>
				<Meta title={name} description={`${locationName} Shelter`} />
			</Card>
		);
	}
}

DogCard.propTypes = {
	ID: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	age: PropTypes.number.isRequired,
	breed: PropTypes.string.isRequired,
	locationName: PropTypes.string.isRequired,
	imageID: PropTypes.number.isRequired,
	loading: PropTypes.bool.isRequired,
	description: PropTypes.string.isRequired
};

export default DogCard;
