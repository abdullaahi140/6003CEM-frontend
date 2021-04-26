import React, { useContext } from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';

import UserContext from '../contexts/user.js';
import FavIcon from './favicon.js';
import Image from './image.js';

function DogCard(props) {
	const { loggedIn } = useContext(UserContext);
	const {
		ID, age, breed, name, locationName, loading, imageID
	} = props;

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
				<Image ID={imageID} alt="dog" style={{ width: '320px', height: '180px', objectFit: 'cover' }} />
			}
		>
			<Card.Meta title={name} description={`${locationName} Shelter`} />
		</Card>
	);
}

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
