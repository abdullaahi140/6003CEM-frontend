import React from 'react';
import { withRouter } from 'react-router-dom';

import {
	Form, Input, Button, Upload, message
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { status, json } from '../utilities/requestHandlers.js';
import jsonToForm from '../utilities/jsonToForm.js';
import UserContext from '../contexts/user.js';

// setting up responsive layout
const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 6 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
};
const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }
};

const usernameRules = [
	{
		required: true,
		message: 'Username must be 3 characters minimum!',
		whitespace: true,
		min: 3
	}
];

const passwordRules = [
	{
		required: true,
		message: 'Username must be 6 characters minimum!',
		min: 6
	}
];

const staffCodeRules = [
	{
		message: 'Username must be 12 characters minimum!',
		min: 12
	}
];

const confirmRules = [
	{ required: true, message: 'Please confirm your password!' },
	/**
	 * Validator that checks if the password and confirm password field matches
	 * @param {} - Function that gets a field from a form using the value prop
	 * @returns Promise that rejects or resolves if the password fields match
	 */
	({ getFieldValue }) => ({
		validator(_rule, value) {
			if (!value || getFieldValue('password') === value) {
				return Promise.resolve();
			}
			return Promise.reject(Error('The password does not match!'));
		}
	})
];

/**
 * Registration form component for app signup.
 */
class RegistrationForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { redirect: false };
		this.onFinish = this.onFinish.bind(this);
	}

	/**
	 * Sumbit handler that posts the form response to the API
	 * @param {Object} values - Object containing all the values entered in the form
	 */
	onFinish(values) {
		fetch('http://localhost:3000/api/v1/users', {
			method: 'POST',
			body: jsonToForm(values)
		})
			.then(status)
			.then(json)
			.then((data) => this.login(data))
			.catch((err) => {
				json(err)
					.then((data) => message.error(data.message));
			});
	}

	/**
	 * Authenticates the new user after registering
	 * @param {object} registeredUser - The user object
	 */
	login(registeredUser) {
		fetch('http://localhost:3000/api/v1/auth/login', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${registeredUser.accessToken.token}`
			}
		})
			.then(status)
			.then(json)
			.then((user) => {
				const { login } = this.context;
				login(user);
				this.setState({ redirect: true });
			});
	}

	render() {
		const { redirect } = this.state;
		const { location, history } = this.props;
		const { from } = location.state || { from: { pathname: '/' } };
		if (redirect) {
			history.push(from.pathname);
		}

		return (
			<Form {...formItemLayout} name="register" onFinish={this.onFinish} scrollToFirstError>
				<Form.Item name="firstName" label="First Name">
					<Input />
				</Form.Item>

				<Form.Item name="lastName" label="Last Name">
					<Input />
				</Form.Item>

				<Form.Item name="username" label="Username" rules={usernameRules}>
					<Input />
				</Form.Item>

				<Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
					<Input.Password />
				</Form.Item>

				<Form.Item
					name="confirm"
					label="Confirm Password"
					dependencies={['password']}
					hasFeedback
					rules={confirmRules}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item name="upload" label="Upload profile picture">
					<Upload
						listType="picture"
						maxCount={1}
						accept="image/*"
						beforeUpload={() => false}
					>
						<Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
					</Upload>
				</Form.Item>

				<Form.Item name="staffCode" label="Staff Code" rules={staffCodeRules}>
					<Input />
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">
						Register
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

RegistrationForm.contextType = UserContext;
RegistrationForm.propTypes = {
	/** Object containing info on the past, present and future location of the app  */
	location: PropTypes.object.isRequired,
	/** Object containing the history of URLs for the app */
	history: PropTypes.object.isRequired
};

export default withRouter(RegistrationForm);
