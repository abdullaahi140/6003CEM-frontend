import React from 'react';
import { useMutation } from 'react-query';
import {
	Form, Input, Button, Upload, message,
} from 'antd';
import axios, { AxiosError } from 'axios';

import UploadOutlined from '@ant-design/icons/UploadOutlined';

import jsonToForm from '../utilities/jsonToForm';
import UserContext from '../contexts/user';
import useLoginUser from '../hooks/useLoginUser';
import { useForm } from 'antd/lib/form/Form';
import { UserBody, UserCreatedResponse } from '../react-app-env';

// setting up responsive layout
const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 6 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
};
const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

const usernameRules = [
	{
		required: true,
		message: 'Username must be 3 characters minimum!',
		whitespace: true,
		min: 3,
	},
];

const passwordRules = [
	{
		required: true,
		message: 'Username must be 6 characters minimum!',
		min: 6,
	},
];

const staffCodeRules = [
	{
		message: 'Username must be 12 characters minimum!',
		min: 12,
	},
];

/**
 * Registration form component for app signup.
 */
function RegistrationForm(): JSX.Element {
	const { mutate: mutateLogin, isLoading: loginLoading } = useLoginUser();
	const [form] = useForm();

	/**
	 * Sumbit handler that posts the form response to the API
	 * @param {Object} values - Object containing all the values entered in the form
	 */
	function postUser(values: UserBody) {
		const { confirm: _confirm, ...data } = values;
		return axios('http://localhost:3000/api/v1/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			data: jsonToForm(data),
		})
			.then((response) => response.data);
	}

	const { mutate, isLoading } = useMutation<UserCreatedResponse, AxiosError, UserBody>(
		postUser, {
			onSuccess: () => {
				mutateLogin(form.getFieldsValue(['username', 'password']));
			},
			onError: (error) => {
				message.error(error.response?.data.message);
			},
		});

	return (
		<Form
			{...formItemLayout}
			name="register"
			onFinish={mutate}
			form={form}
			scrollToFirstError
		>
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
				rules={[
					{ required: true, message: 'Please confirm your password!' },
					/**
					 * Validator that checks if the password and confirm password field matches
					 * @param {getFieldValue} - Function that gets a field from a form using the value prop
					 * @returns Promise that rejects or resolves if the password fields match
					 */
					({ getFieldValue }) => ({
						validator(_rule, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject(Error('The password does not match!'));
						},
					}),
				]}
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
				<Button
					loading={isLoading || loginLoading}
					type="primary"
					htmlType="submit"
				>
					Register
				</Button>
			</Form.Item>
		</Form>
	);
}

RegistrationForm.contextType = UserContext;

export default RegistrationForm;
