import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import {
	Button, Input, List, PageHeader, Form,
} from 'antd';
import SendOutlined from '@ant-design/icons/SendOutlined';

import axios from 'axios';
import Comment from './comment';
import useAuthentication from '../hooks/useAuthentication';
import { Message as IMessage } from '../react-app-env';

/**
 * Component that displays a list of current messages and a form to send new messages.
 */
function Message(): JSX.Element {
	const { state: { accessToken } } = useAuthentication();
	const { chatID } = useParams<{ chatID: string }>();
	const history = useHistory();
	const [value, setValue] = useState('');

	/**
	 * Get request to retrieve all messages for the current chat.
	 */
	function fetchChat() {
		return axios(`http://localhost:3000/api/v1/chats/${chatID}`, {
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		})
			.then((response) => response.data);
	}

	const { data: chat, isSuccess: chatSuccess } = useQuery(['chat', chatID], fetchChat);

	/**
	 * Fetch messages for the current chat.
	 */
	function fetchMessages() {
		return axios(`http://localhost:3000/api/v1/messages/${chatID}`, {
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		})
			.then((response) => response.data);
	}

	const { data: messages, isSuccess: msgSuccess } = useQuery(
		['messages', chatID], fetchMessages, {
			refetchInterval: 1000,
		},
	);

	/**
 * Submits the form if a message is provided for the current chat.
 */
	function postMessage() {
		if (!value) {
			// don't post if text area is empty
			return Promise.reject('Cannot send empty message');
		}

		return axios(`http://localhost:3000/api/v1/messages/${chatID}`, {
			method: 'POST',
			data: { message: value },
			headers: {
				Authorization: `Bearer ${accessToken?.token}`,
			},
		});
	}

	const { mutate } = useMutation(postMessage, {
		onSuccess: () => {
			setValue('');
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // scroll to bottom
		},
	});

	return (
		<div style={{ padding: '0% 10% 1%' }}>
			{chatSuccess && (
				<PageHeader
					className="site-page-header"
					title={`${chat.locationName} Shelter`}
					subTitle="Have a chat with us and we'll try our best."
					onBack={() => history.push('/chats')}
				/>
			)}

			{msgSuccess && (
				<List
					style={{ padding: '2rem 2rem 0rem' }}
					header={`${messages.length} messages`}
					itemLayout="horizontal"
					dataSource={messages}
					renderItem={(message: IMessage) => (
						<li>
							<Comment {...message} />
						</li>
					)}
				/>
			)}

			<Form
				// className="blur-form"
				style={{ position: 'sticky', bottom: '0rem', backgroundColor: '#FFFFFF' }}
				onFinish={mutate}
			>
				<Form.Item>
					<Input.TextArea
						name="message"
						rows={4}
						value={value}
						placeholder="Type your message here"
						onChange={(event) => setValue(event.target.value)}
					/>
				</Form.Item>
				<Form.Item>
					{value.length > 0 && (
						<Button
							style={{ marginBottom: '2rem' }}
							type="primary"
							htmlType="submit"
							icon={<SendOutlined />}
						>
							Send Message
						</Button>
					)}
				</Form.Item>
			</Form>
		</div>
	);
}

export default Message;
