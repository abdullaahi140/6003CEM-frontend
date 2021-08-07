import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import {
	Col, PageHeader, Row, Form, Select, Button, message
} from 'antd';
import axios from 'axios';

import ChatCard from './chatcard.js';
import useAuthentication from '../hooks/useAuthentication.js';

/**
 * Chat component with list of chats linking to pages with all messages
 * for a particular chat.
 */
function Chat() {
	const { state: { user, accessToken } } = useAuthentication();
	const history = useHistory();

	/**
	 * Fetch list of chats depending on the user's role
	 */
	function fetchChats() {
		const { role, locationID } = user;
		let url = 'http://localhost:3000/api/v1/chats';
		if (role !== 'user') {
			url = `${url}/location/${locationID}`;
		}
		return axios(url, {
			headers: {
				Authorization: `Bearer ${accessToken.token}`
			}
		})
			.then((response) => response.data);
	}

	const { data: chats, isSuccess: chatSuccess } = useQuery('chats', fetchChats);

	/**
	 * Fetch list of shelters that the user hasn't started a chat with.
	 */
	function fetchShelters() {
		return axios('http://localhost:3000/api/v1/locations', {
			headers: {
				Authorization: `Bearer ${accessToken.token}`
			}
		})
			.then((response) => response.data);
	}

	const { data: shelters, isSuccess: shelterSuccess } = useQuery('shelters', fetchShelters);

	/**
	 * Post a request to start a new chat with a shelter
	 */
	function postChat(values) {
		return axios(`http://localhost:3000/api/v1/chats/${values.shelter}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken.token}`
			}
		})
			.then((response) => response.data);
	}

	const { mutate } = useMutation(postChat, {
		onSuccess: (data) => history.push(`/messages/${data.ID}`),
		onError: () => message.error('Chat could not be created')
	});

	const shelterList = shelterSuccess && shelters.map((shelter) => (
		<Select.Option key={shelter.ID} value={shelter.ID}>{shelter.name}</Select.Option>
	));

	const cardList = chatSuccess && chats.map((chat) => {
		const dateCreated = new Date(Date.parse(chat.dateCreated)).toLocaleString();
		return (
			<div style={{ paddingTop: '1rem', paddingRight: '1rem' }} key={chat.ID}>
				<Col span={6}>
					<ChatCard
						chatID={chat.ID}
						title={chat.locationName}
						dateCreated={dateCreated}
					>
						<p>{`Created: ${dateCreated}`}</p>
					</ChatCard>
				</Col>
			</div>
		);
	});

	return (
		<div style={{ padding: '0% 10% 1%', textAlign: 'center' }}>
			<PageHeader
				style={{ padding: '0% 0% 1%' }}
				className="site-page-header"
				title="Chat with a charity shelter"
				subTitle="Browse through your chats or start a new one."
			/>

			{shelterSuccess && (
				<Form
					layout="inline"
					initialValues={{ shelter: shelters[0].ID }}
					onFinish={mutate}
				>
					<Form.Item label="Start a new chat" name="shelter">
						<Select
							name="shelter"
							style={{ width: 200 }}
							disabled={(shelters.length < 1)}
						>
							{shelterList}
						</Select>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							disabled={(shelters.length < 1)}
						>
							Create Chat
						</Button>
					</Form.Item>
				</Form>
			)}

			<Row type="flex" justify="start">
				{chatSuccess && cardList}
			</Row>
		</div>
	);
}

export default Chat;
