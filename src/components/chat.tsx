import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import {
	Col, PageHeader, Row, Form, Select, Button, message,
} from 'antd';
import axios, { AxiosError } from 'axios';

import ChatCard from './chatcard';
import useAuthentication from '../hooks/useAuthentication';
import { Chat as IChat, ChatResponse, Shelter } from '../react-app-env';

interface QueryParam {
	shelter: string;
}

/**
 * Chat component with list of chats linking to pages with all messages
 * for a particular chat.
 */
function Chat(): JSX.Element {
	const { state: { user, accessToken } } = useAuthentication();
	const history = useHistory();
	const queryClient = useQueryClient();

	/**
	 * Fetch list of chats depending on the user's role
	 */
	function fetchChats() {
		const { role, locationID } = { ...user };
		let url = `${process.env.REACT_APP_API_URL}/api/v1/chats`;
		if (role !== 'user') {
			url = `${url}/location/${locationID}`;
		}
		return axios(url, {
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		})
			.then((response) => response.data);
	}

	const { data: chats, isSuccess: chatSuccess } = useQuery('chats', fetchChats);

	/**
	 * Fetch list of shelters that the user hasn't started a chat with.
	 */
	function fetchShelters() {
		return axios(`${process.env.REACT_APP_API_URL}/api/v1/locations`, {
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		})
			.then((response) => response.data);
	}

	const { data: shelters, isSuccess: shelterSuccess } = useQuery('shelters', fetchShelters);

	/**
	 * Post a request to start a new chat with a shelter
	 */
	function postChat({ shelter }: QueryParam) {
		return axios(`${process.env.REACT_APP_API_URL}/api/v1/chats/${shelter}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		})
			.then((response) => response.data)
			.catch((_error) => message.error('Chat could not be created'));
	}

	const { mutate } = useMutation<ChatResponse, AxiosError, QueryParam>(
		postChat, {
			onSuccess: (data) => {
				queryClient.invalidateQueries('shelters');
				history.push(`/messages/${data.ID}`);
			},
			// onError: () => message.error('Chat could not be created'),
			// do we call expression for onError?
		});

	const shelterList = shelterSuccess && shelters.map((shelter: Shelter) => (
		<Select.Option key={shelter.ID} value={shelter.ID}>{shelter.name}</Select.Option>
	));

	const cardList = chatSuccess && chats.map((chat: IChat) => {
		const dateCreated = new Date(Date.parse(chat.dateCreated)).toLocaleString();
		return (
			<div style={{ paddingTop: '1rem', paddingRight: '1rem' }} key={chat.ID}>
				<Col span={6}>
					<ChatCard
						chatID={chat.ID}
						title={chat.locationName}
						dateCreated={dateCreated}
					/>
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

			<Row justify="start">
				{chatSuccess && cardList}
			</Row>
		</div>
	);
}

export default Chat;
