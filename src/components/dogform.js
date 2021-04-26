import React from 'react';
import {
	Button, Form, Input, InputNumber, Layout, message, PageHeader, Select, TreeSelect, Upload
} from 'antd';
import { PlusOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import UserContext from '../contexts/user.js';
import { json, status } from '../utilities/requestHandlers.js';
import jsonToForm from '../utilities/jsonToForm.js';

class DogForm extends React.Component {
	constructor(props) {
		super(props);
		const { match } = this.props;
		const { dogID } = match.params;
		this.state = {
			dogID,
			method: (dogID) ? 'PUT' : 'POST',
			shelter: '',
			breed: '',
			breeds: {},
			imgURL: ''
		};
		this.formRef = React.createRef(); // Create reference to clear form later

		this.handleSelect = this.handleSelect.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.fetchShelterName = this.fetchShelterName.bind(this);
		this.fetchBreedList = this.fetchBreedList.bind(this);
	}

	componentDidMount() {
		this.fetchDog();
		this.fetchShelterName();
		this.fetchBreedList();
	}

	handleSelect(value) {
		this.setState({ breed: value });
		let breed = value.split(' ').reverse();
		breed = breed.map((item) => item.toLowerCase());
		breed = breed.join('/');
		fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
			.then(status)
			.then(json)
			.then((data) => this.setState({ imgURL: data.message }))
			.catch((err) => console.error(err));
	}

	handleSubmit(values) {
		const { user } = this.context;
		const { dogID, method } = this.state;
		let url = 'http://localhost:3000/api/v1/dogs';
		url = (dogID) ? `${url}/${dogID}` : url;
		fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			},
			body: jsonToForm(values)
		})
			.then(status)
			.then(() => this.formRef.current.resetFields())
			.catch((err) => {
				console.error(err);
				(dogID) && message.error('You can not update this dog');
			});
	}

	fetchDog() {
		const { dogID } = this.state;
		if (!dogID) return; // prevent fetching dog if no dogID
		fetch(`http://localhost:3000/api/v1/dogs/${dogID}`)
			.then(status)
			.then(json)
			.then((data) => this.formRef.current.setFieldsValue(data))
			.catch((err) => console.error(err));
	}

	fetchShelterName() {
		const { user } = this.context;
		fetch(`http://localhost:3000/api/v1/locations/${user.user.locationID}`, {
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then((data) => this.setState({ shelter: data.name }))
			.catch((err) => console.error(err));
	}

	fetchBreedList() {
		fetch('https://dog.ceo/api/breeds/list/all')
			.then(status)
			.then(json)
			.then((data) => this.setState({ breeds: data.message }))
			.catch((err) => console.error(err));
	}

	capitalise(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	render() {
		const { user } = this.context;
		const {
			dogID, shelter, breed, breeds, imgURL
		} = this.state;
		const { history } = this.props;
		if (user.user.role === 'user') {
			history.push('/'); // send regular users to home page
		}

		const breedList = [];
		// eslint-disable-next-line no-restricted-syntax
		for (const [key, value] of Object.entries(breeds)) {
			const children = value.map((child) => ({
				title: `${this.capitalise(child)} ${this.capitalise(key)}`,
				value: `${this.capitalise(child)} ${this.capitalise(key)}`
			}));
			const treeNode = {
				title: this.capitalise(key),
				value: this.capitalise(key),
				children
			};
			breedList.push(treeNode);
		}

		// responsive layout for form
		const formItemLayout = {
			labelCol: { xs: { span: 12 }, sm: { span: 3 } },
			wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
		};

		const tailFormItemLayout = {
			wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 3 } }
		};

		// Form rules
		const nameRules = [{
			required: true,
			message: 'Name must be 2 characters minimum!',
			whitespace: true,
			min: 2
		}];
		const ageRules = [{
			required: true,
			message: 'You must provide an age!'
		}];
		const genderRules = [{
			required: true,
			message: 'You must provide the gender!'
		}];
		const breedRules = [{
			required: true,
			message: 'You must provide the breed of the dog!'
		}];
		const descriptionRules = [{
			required: true,
			message: 'Description must be 10 characters minimum!',
			whitespace: true,
			min: 10
		}];

		return (
			<Layout style={{ background: 'white', padding: '0% 10% 1%' }}>
				<Layout.Content>
					<PageHeader
						className="site-page-header"
						title={(dogID) ? "Update a dog's details"
							: `Add a dog to ${shelter} Shelter`}
						subTitle="Let's get them a home"
					/>

					<Form {...formItemLayout} ref={this.formRef} onFinish={this.handleSubmit}>
						<Form.Item name="name" label="Name" rules={nameRules} hasFeedback>
							<Input />
						</Form.Item>
						<Form.Item name="age" label="Age" rules={ageRules} hasFeedback>
							<InputNumber min={0} />
						</Form.Item>
						<Form.Item name="gender" label="Gender" rules={genderRules} hasFeedback>
							<Select>
								<Select.Option value="Male">Male</Select.Option>
								<Select.Option value="Female">Female</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item name="breed" label="Breed" rules={breedRules} hasFeedback>
							<TreeSelect
								treeDefaultExpandAll
								treeData={breedList}
								onSelect={this.handleSelect}
							/>
						</Form.Item>
						<Form.Item name="description" label="Description" rules={descriptionRules} hasFeedback>
							<Input.TextArea rows={4} />
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
						<Form.Item {...tailFormItemLayout}>
							<Button
								type="primary"
								htmlType="submit"
								icon={(dogID) ? <SaveOutlined /> : <PlusOutlined />}
							>
								{(dogID) ? 'Update dog' : 'Add dog'}
							</Button>
						</Form.Item>
					</Form>
				</Layout.Content>
				{(imgURL) && (
					<Layout.Sider style={{ background: 'white' }} width={400}>
						<PageHeader
							className="site-page-header"
							title="Example image"
							subTitle={`${breed}`}
						/>
						<img src={imgURL} alt="dog" width={400} />
					</Layout.Sider>
				)}
			</Layout>
		);
	}
}

DogForm.contextType = UserContext;
DogForm.propTypes = {
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired
};

export default DogForm;
