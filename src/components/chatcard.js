import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import DeleteIcon from './deleteicon.js';

import { status } from '../utilities/requestHandlers.js';
import UserContext from '../contexts/user.js';

/**
 * Card component for a chat.
 */
class ChatCard extends React.Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	/**
	 * Delete a chat then update the list of chats.
	 */
	handleDelete() {
		const { user } = this.context;
		const { chatID, updateParent } = this.props;
		fetch(`http://localhost:3000/api/v1/chats/${chatID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${user.accessToken.token}`
			}
		})
			.then(status)
			.then(() => updateParent())
			.catch((err) => console.error(err));
	}

	render() {
		const { chatID, title, dateCreated } = this.props;
		return (

			<Card
				style={{ width: 320 }}
				hoverable
				size="small"
				chatID={chatID}
				title={<Link style={{ color: 'black' }} to={`/messages/${chatID}`}>{title}</Link>}
				extra={<DeleteIcon handleConfirm={this.handleDelete} />}
			>
				<Link to={`/messages/${chatID}`}>{`Created: ${dateCreated}`}</Link>
			</Card>

		);
	}
}

ChatCard.contextType = UserContext;
ChatCard.propTypes = {
	/** ID of chat */
	chatID: PropTypes.number.isRequired,
	/** Function to update list of chats from parent component */
	updateParent: PropTypes.func.isRequired,
	/** Title of the chat */
	title: PropTypes.string.isRequired,
	/** Datetime of the chat being created */
	dateCreated: PropTypes.string.isRequired
};

export default ChatCard;
