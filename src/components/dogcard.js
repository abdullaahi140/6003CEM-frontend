import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';
import UserContext from '../contexts/user.js';
import FavIcon from './favicon.js';

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
		const { loggedIn } = this.context;
		const { image } = this.state;
		const {
			ID, age, breed, name, locationName, loading
		} = this.props;

		const actions = [
			<p key={ID}>
				Age:
				{age}
			</p>,
			<p key={ID}>
				{breed}
			</p>
		];

		if (loggedIn) {
			actions.push(<FavIcon key={ID} dogID={ID} />);
		}

		return (
			<Card
				style={{ width: 320 }}
				hoverable
				loading={loading}
				actions={actions}
				cover={
					<img src={image} alt="dog" style={{ width: '320px', height: '180px', objectFit: 'cover' }} />
				}
			>
				<Meta title={name} description={`${locationName} Shelter`} />
			</Card>
		);
	}
}

DogCard.contextType = UserContext;
DogCard.propTypes = {
	ID: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	age: PropTypes.number.isRequired,
	breed: PropTypes.string.isRequired,
	locationName: PropTypes.string.isRequired,
	imageID: PropTypes.number.isRequired,
	loading: PropTypes.bool.isRequired
};

export default DogCard;
