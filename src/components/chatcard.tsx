import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { Card } from 'antd';
import axios from 'axios';

import PropTypes from 'prop-types';

import DeleteIcon from './deleteicon';
import useAuthentication from '../hooks/useAuthentication';

interface Props {
	chatID: number;
	title: string;
	dateCreated: string;
}

/**
 * Card component for a chat.
 */
function ChatCard(props: Props): JSX.Element {
	const { state: { accessToken } } = useAuthentication();
	const { chatID, title, dateCreated } = props;
	const queryClient = useQueryClient();

	/**
	 * Delete a chat then update the list of chats.
	 */
	function deleteChat() {
		return axios(`http://localhost:3000/api/v1/chats/${chatID}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		});
	}

	const { mutate } = useMutation(deleteChat, {
		onSuccess: () => {
			queryClient.refetchQueries('chats');
			queryClient.refetchQueries('shelters');
		},
	});

	return (
		<Card
			style={{ width: 320 }}
			hoverable
			size="small"
			title={<Link style={{ color: 'black' }} to={`/messages/${chatID}`}>{title}</Link>}
			extra={<DeleteIcon handleConfirm={mutate} />}
		>
			<Link to={`/messages/${chatID}`}>{`Created: ${dateCreated}`}</Link>
		</Card>

	);
}

ChatCard.propTypes = {
	/** ID of chat */
	chatID: PropTypes.number.isRequired,
	/** Title of the chat */
	title: PropTypes.string.isRequired,
	/** Datetime of the chat being created */
	dateCreated: PropTypes.string.isRequired,
};

export default ChatCard;
