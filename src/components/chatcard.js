import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import DeleteIcon from './deleteicon.js';

import { status } from '../utilities/requestHandlers.js';
import UserContext from '../contexts/user.js';

class ChatCard extends React.Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		const { user } = this.context;
		const { chatID, updateParent } = this.props;
		fetch(`http://localhost:3000/api/v1/chats/${chatID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${user.accessToken}`
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
	chatID: PropTypes.number.isRequired,
	updateParent: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	dateCreated: PropTypes.string.isRequired
};

export default ChatCard;
