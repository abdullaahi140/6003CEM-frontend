import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, message } from 'antd';
import PropTypes from 'prop-types';

import { EditFilled, EditOutlined } from '@ant-design/icons';
import UserContext from '../contexts/user.js';
import FavIcon from './favicon.js';
import Image from './image.js';
import DeleteIcon from './deleteicon.js';
import { status } from '../utilities/requestHandlers.js';

class DogCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hover: false
		};
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		const { user } = this.context;
		const { ID, updateParent } = this.props;
		fetch(`http://localhost:3000/api/v1/dogs/${ID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(() => updateParent())
			.catch((err) => {
				console.error(err);
				message.error('You can not delete this dog');
			});
	}

	render() {
		const { loggedIn, user } = this.context;
		const { hover } = this.state;
		const {
			ID, age, breed, name, locationName, loading, imageID, history
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

		if (loggedIn && user.user.role !== 'user') {
			actions.push(
				(hover) ? (
					<EditFilled
						style={{ color: 'orange' }}
						onMouseLeave={() => this.setState({ hover: false })}
						onClick={() => history.push(`/dog_form/${ID}`)}
					/>
				)
					: (
						<EditOutlined
							style={{ color: 'orange' }}
							onMouseOver={() => this.setState({ hover: true })}
						/>
					)
			);
			actions.push(<DeleteIcon handleConfirm={this.handleDelete} key={ID} />);
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
}

DogCard.contextType = UserContext;
DogCard.propTypes = {
	ID: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	age: PropTypes.number.isRequired,
	breed: PropTypes.string.isRequired,
	locationName: PropTypes.string.isRequired,
	imageID: PropTypes.number.isRequired,
	updateParent: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	history: PropTypes.object.isRequired
};

export default withRouter(DogCard);
