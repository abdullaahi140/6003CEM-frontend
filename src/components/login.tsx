import React from 'react';
// import GoogleOutlined from '@ant-design/icons/GoogleOutlined';
// import OauthPopup from 'react-oauth-popup';
// import { GoogleLogin } from 'react-google-login';
import { Form, Input, Button } from 'antd';
import useLoginUser from '../hooks/useLoginUser';

// add some layout to keep the form organised on different screen sizes
const formItemLayout = {
	labelCol: { xs: { span: 24 }, sm: { span: 6 } },
	wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
};
const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } },
};

// define validation rules for the form fields
const passwordRules = [
	{ required: true, message: 'Please input your password!' },
];

const usernameRules = [
	{ required: true, message: 'Please input your username!', whitespace: true },
];

/**
 * Login form component for app signup.
 */
function LoginForm(): JSX.Element {
	const { mutate, isLoading } = useLoginUser();

	/**
	 * Function that fetch Google auth
	 */
	/* function handleGoogle() {
		fetch('http://localhost:3000/api/v1/auth/google/callback')
			.then(status)
			.then(json)
			.then((user) => {
				// eslint-disable-next-line no-console
				console.log(user);
				login(user);
				setRedirect(true);
			})
			.catch((err) => {
				console.error(err);
			});
	} */

	return (
		<Form {...formItemLayout} name="login" onFinish={mutate} scrollToFirstError>
			<Form.Item name="username" label="Username" rules={usernameRules}>
				<Input />
			</Form.Item>
			<Form.Item name="password" label="Password" rules={passwordRules} hasFeedback>
				<Input.Password />
			</Form.Item>
			<Form.Item {...tailFormItemLayout}>
				<Button
					style={{ marginBottom: '1rem' }}
					type="primary"
					htmlType="submit"
					loading={isLoading}
				>
					Login
				</Button>

				{/* <OauthPopup
					url="http://localhost:3000/api/v1/auth/google/callback"
					onCode={(code, params) => {
						// eslint-disable-next-line no-console
						console.log(code);
						// eslint-disable-next-line no-console
						console.log(params);
					}}
					onClose={() => console.error('closed')}
				>
					<Button
						style={{ marginBottom: '1rem' }}
						icon={<GoogleOutlined />}
					>
						Login with Google
					</Button>
				</OauthPopup>

				<GoogleLogin
					clientId="696194467983-4768pffc83ej6kf8v666q4kneivttn1n.apps.googleusercontent.com"
					buttonText="Login"
					onSuccess={handleSuccess}
					cookiePolicy=""
				/> */}

			</Form.Item>
		</Form>
	);
}

export default LoginForm;
