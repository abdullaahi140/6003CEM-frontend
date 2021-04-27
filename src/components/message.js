import React from 'react';
import { withRouter } from 'react-router-dom';

import {
	Button, Input, List, PageHeader, Form
} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Comment from './comment.js';
import UserContext from '../contexts/user.js';
import { json, status } from '../utilities/requestHandlers.js';

class Message extends React.Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		this.state = {
			chatID: match.params.chatID,
			shelterName: '',
			messages: [],
			value: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.fetchMessages = this.fetchMessages.bind(this);
	}

	componentDidMount() {
		const { user } = this.context;
		const { chatID } = this.state;
		fetch(`http://localhost:3000/api/v1/chats/${chatID}`, {
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then((data) => this.setState({ shelterName: data.locationName }))
			.catch((err) => console.error(err));
		this.fetchMessages();
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit() {
		const { user } = this.context;
		const { chatID, value } = this.state;
		if (!value) {
			return; // don't post if text area is empty
		}

		fetch(`http://localhost:3000/api/v1/messages/${chatID}`, {
			method: 'POST',
			body: JSON.stringify({ message: value }),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then(() => {
				this.setState({ value: '' });
				this.fetchMessages();
				window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // scroll to bottom
			})
			.catch((err) => {
				json(err)
					.then((data) => console.error(data));
			});
	}

	fetchMessages() {
		const { user } = this.context;
		const { chatID } = this.state;
		fetch(`http://localhost:3000/api/v1/messages/${chatID}`, {
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then((data) => this.setState({ messages: data }))
			.catch((err) => {
				console.error(err);
				this.setState({ messages: [] });
			});
	}

	render() {
		const { shelterName, messages, value } = this.state;
		const { history } = this.props;
		return (
			<div style={{ padding: '0% 10% 1%' }}>
				<PageHeader
					className="site-page-header"
					title={`${shelterName} Shelter`}
					subTitle="Have a chat with us and we'll try our best."
					onBack={() => history.push('/chats')}
				/>

				<List
					style={{ padding: '2rem' }}
					header={`${messages.length} messages`}
					itemLayout="horizontal"
					dataSource={messages}
					renderItem={(item) => (
						<li>
							<Comment
								{...item}
								updateParent={this.fetchMessages}
							/>
						</li>
					)}
				/>

				<Form className="blur-form" style={{ position: 'sticky', bottom: '0.5rem' }} onFinish={this.handleSubmit}>
					<Form.Item>
						<Input.TextArea
							name="message"
							disabled={(shelterName === '')}
							rows={4}
							value={value}
							onChange={this.handleChange}
						/>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							icon={<SendOutlined />}
							disabled={(shelterName === '')}
						>
							Send Message
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

Message.contextType = UserContext;
Message.propTypes = {
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

export default withRouter(Message);
