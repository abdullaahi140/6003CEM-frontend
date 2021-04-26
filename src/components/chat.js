import React from 'react';
import { withRouter } from 'react-router-dom';
import {
	Col, PageHeader, Row, Form, Select, Button, message
} from 'antd';
import PropTypes from 'prop-types';

import ChatCard from './chatcard.js';
import { json, status } from '../utilities/requestHandlers.js';
import UserContext from '../contexts/user.js';

class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = { chats: [], shelters: [] };
		this.fetchChats = this.fetchChats.bind(this);
		this.fetchShelters = this.fetchShelters.bind(this);
		this.handleConfirm = this.handleConfirm.bind(this);
	}

	componentDidMount() {
		this.fetchChats();
	}

	handleConfirm(values) {
		const { user } = this.context;
		const { history } = this.props;
		fetch(`http://localhost:3000/api/v1/chats/${values.shelter}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then((data) => history.push(`/messages/${data.ID}`))
			.catch((err) => {
				console.error(err);
				message.error('Chat could not be created');
			});
	}

	fetchChats() {
		const { user } = this.context;
		const { role, locationID } = user.user;
		let url = 'http://localhost:3000/api/v1/chats';
		if (role !== 'user') {
			url = `${url}/location/${locationID}`;
		}
		fetch(url, {
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then((data) => this.setState({ chats: data }))
			.catch((err) => {
				this.setState({ chats: [] });
				console.error(err);
			});
		this.fetchShelters();
	}

	fetchShelters() {
		const { user } = this.context;
		fetch('http://localhost:3000/api/v1/locations', {
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then((data) => this.setState({ shelters: data }))
			.catch((err) => {
				console.error(err);
				this.setState({ shelters: [] });
			});
	}

	render() {
		const { chats, shelters } = this.state;
		const shelterList = shelters.map((shelter, index) => (
			// eslint-disable-next-line react/no-array-index-key
			<Select.Option key={index} value={shelter.ID}>{shelter.name}</Select.Option>
		));

		const cardList = chats.map((chat) => {
			const dateCreated = new Date(Date.parse(chat.dateCreated)).toLocaleString();
			return (
				<div style={{ paddingTop: '1rem', paddingRight: '1rem' }} key={chat.ID}>
					<Col span={6}>
						<ChatCard
							chatID={chat.ID}
							title={chat.locationName}
							dateCreated={dateCreated}
							updateParent={this.fetchChats}
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

				<Form layout="inline" onFinish={this.handleConfirm}>
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

				<Row type="flex" justify="start">
					{cardList}
				</Row>
			</div>
		);
	}
}

Chat.contextType = UserContext;
Chat.propTypes = {
	history: PropTypes.func.isRequired
};

export default withRouter(Chat);
