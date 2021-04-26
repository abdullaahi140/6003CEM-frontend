import React from 'react';
import { Comment, message as Message } from 'antd';
import PropTypes from 'prop-types';
import UserContext from '../contexts/user.js';
import DeleteIcon from './deleteicon.js';
import { status } from '../utilities/requestHandlers.js';
import Image from './image.js';

class MessageComment extends React.Component {
	constructor(props) {
		super(props);
		this.handleConfirm = this.handleConfirm.bind(this);
	}

	handleConfirm() {
		const { user } = this.context;
		const { ID, updateParent } = this.props;
		fetch(`http://localhost:3000/api/v1/messages/${ID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${user.accessToken}`
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
				actions={[<DeleteIcon handleConfirm={this.handleConfirm} key={ID} />]}
			/>
		);
	}
}

MessageComment.contextType = UserContext;
MessageComment.propTypes = {
	ID: PropTypes.number.isRequired,
	senderImageID: PropTypes.number.isRequired,
	senderName: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	dateCreated: PropTypes.string.isRequired,
	updateParent: PropTypes.func.isRequired
};

export default MessageComment;
