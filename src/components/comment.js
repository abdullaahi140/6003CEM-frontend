import React from 'react';
import { Comment, message as Message } from 'antd';
import PropTypes from 'prop-types';
import UserContext from '../contexts/user.js';
import DeleteIcon from './deleteicon.js';
import { status } from '../utilities/requestHandlers.js';
import Image from './image.js';

/**
 * Component that renders a single message from a chat.
 */
class MessageComment extends React.Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	/**
	 * Delete a message from a chat.
	 */
	handleDelete() {
		const { user } = this.context;
		const { ID, updateParent } = this.props;
		fetch(`http://localhost:3000/api/v1/messages/${ID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${user.accessToken.token}`
			}
		})
			.then(status)
			.then(() => updateParent())
			.catch((err) => {
				console.error(err);
				Message.error('You can not delete this message');
			});
	}

	render() {
		const {
			ID, senderName, senderImageID, message, dateCreated
		} = this.props;
		return (
			<Comment
				author={senderName}
				avatar={<Image ID={senderImageID} alt={senderName} />}
				content={message}
				datetime={new Date(Date.parse(dateCreated)).toLocaleString()}
				actions={[<DeleteIcon handleConfirm={this.handleDelete} key={ID} />]}
			/>
		);
	}
}

MessageComment.contextType = UserContext;
MessageComment.propTypes = {
	/** ID of message */
	ID: PropTypes.number.isRequired,
	/** Image ID of user who sent message */
	senderImageID: PropTypes.number.isRequired,
	/** Name of user who sent message */
	senderName: PropTypes.string.isRequired,
	/** The message string */
	message: PropTypes.string.isRequired,
	/** Datetime of the message being sent */
	dateCreated: PropTypes.string.isRequired,
	/** Function to update list of messages from parent component */
	updateParent: PropTypes.func.isRequired
};

export default MessageComment;
