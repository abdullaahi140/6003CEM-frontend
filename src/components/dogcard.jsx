import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { Card, message } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

import EditFilled from '@ant-design/icons/EditFilled';
import EditOutlined from '@ant-design/icons/EditOutlined';

import useAuthentication from '../hooks/useAuthentication';

import DeleteIcon from './deleteicon';
import FavIcon from './favicon';
import Image from './image';

/**
 * Card component displaying a dog
 */
function DogCard(props) {
	const { state: { user, loggedIn, accessToken } } = useAuthentication();
	const [hover, setHover] = useState(false);
	const history = useHistory();
	const queryClient = useQueryClient();
	const {
		ID, age, breed, name, locationName, loading, imageID
	} = props;

	/**
	 * Handler function that deletes a dog.
	 */
	function postDeleteDog({ ID: dogID }) {
		return axios(`http://localhost:3000/api/v1/dogs/${dogID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken.token
				}`
			}
		});
	}

	const { mutate } = useMutation(postDeleteDog, {
		onSuccess: () => queryClient.invalidateQueries('dogs'),
		onError: (error) => {
			console.error(error);
			message.error('You can not delete this dog');
		}
	});

	const actions = [
		<p key={ID}>
			Age:&nbsp;
			{age}
		</p>,
		<p key={ID}>
			{breed}
		</p>
	];

	if (loggedIn) {
		actions.push(<FavIcon key={ID} dogID={ID} />);
	}

	if (loggedIn && user.role !== 'user') {
		actions.push(
			(hover) ? (
				<EditFilled
					style={{ color: 'orange' }}
					onMouseLeave={() => setHover(false)}
					onClick={() => history.push(`/dog_form/${ID}`)}
				/>
			)
				: (
					<EditOutlined
						style={{ color: 'orange' }}
						onMouseOver={() => setHover(true)}
					/>
				)
		);
		actions.push(<DeleteIcon handleConfirm={() => mutate({ ID })} key={ID} />);
	}

	return (
		<Card
			style={{ width: 432 }}
			hoverable
			loading={loading}
			actions={actions}
			cover={(
				<Image
					ID={imageID}
					alt="dog"
					style={{ width: '432px', height: '243px', objectFit: 'cover' }}
					onClick={() => history.push(`/dog/${ID}`)}
				/>
			)}
		>
			<Card.Meta
				title={name}
				description={`${locationName} Shelter`}
				onClick={() => history.push(`/dog/${ID}`)}
			/>
		</Card>
	);
}

DogCard.propTypes = {
	/** ID of the dog */
	ID: PropTypes.number.isRequired,
	/** Name of the dog */
	name: PropTypes.string.isRequired,
	/** Age of the dog */
	age: PropTypes.number.isRequired,
	/** Breed of dog */
	breed: PropTypes.string.isRequired,
	/** Name of shelter */
	locationName: PropTypes.string.isRequired,
	/** Image ID of Dog */
	imageID: PropTypes.number.isRequired,
	/** Function to fetch list of dogs again */
	loading: PropTypes.bool.isRequired
};

export default DogCard;
