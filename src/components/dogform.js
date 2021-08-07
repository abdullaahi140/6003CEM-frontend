import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import {
	Button, Form, Input, InputNumber, Layout, message, PageHeader, Select, TreeSelect, Upload
} from 'antd';
import axios from 'axios';

import PlusOutlined from '@ant-design/icons/PlusOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import UploadOutlined from '@ant-design/icons/UploadOutlined';

import jsonToForm from '../utilities/jsonToForm.js';
import useAuthentication from '../hooks/useAuthentication.js';

/**
 * Form component to add a new dog to a staff's shelter
 */
function DogForm() {
	const { state: { user, accessToken } } = useAuthentication();
	const { dogID } = useParams();
	const [value, setValue] = useState();
	const [form] = Form.useForm();

	function handleSelect(selectValue) {
		let dogBreed = selectValue.split(' ').reverse();
		dogBreed = dogBreed.map((item) => item.toLowerCase());
		dogBreed = dogBreed.join('/');
		setValue(dogBreed);
	}

	/**
	 * Function that fetches an example image of a particular breed of dog
	 * @param {string} value - The breed of dog
	 */
	function fetchDogImage() {
		return axios(`https://dog.ceo/api/breed/${value}/images/random`)
			.then((repsonse) => repsonse.data.message);
	}

	const { data: dogImgURL, isSuccess: dogImgURlSuccess } = useQuery(
		['dogImage', value], fetchDogImage, {
			enabled: value !== undefined
		}
	);

	/**
	 * Fetch a dog to populate their details in the form.
	 */
	function fetchDog() {
		return axios(`http://localhost:3000/api/v1/dogs/${dogID}`)
			.then((response) => response.data);
	}

	useQuery(['dog', dogID], fetchDog, {
		enabled: dogID > 0,
		onSuccess: (data) => form.setFieldsValue(data)
	});

	/**
	 * Fetches the staff's shelter to set name as the header.
	 */
	function fetchShelter() {
		return axios(`http://localhost:3000/api/v1/locations/${user.locationID}`, {
			headers: {
				Authorization: `Bearer ${accessToken.token}`
			}
		})
			.then((response) => response.data);
	}

	const { data: shelter, isSuccess: shelterSuccess } = useQuery(
		['shelter', user.locationID],
		fetchShelter
	);

	/**
	 * Fetches a list of breeds from the Dog API
	 */
	function fetchBreedList() {
		return axios('https://dog.ceo/api/breeds/list/all')
			.then((response) => response.data.message);
	}

	const { data: breeds, isSuccess: breedsSuccess } = useQuery('dogAPIBreeds', fetchBreedList);

	/**
	 * Post the form to either add or update a dog.
	 * @param {Object} values - Values for field in the submitted form
	 */
	function postOrPutDog(values) {
		let url = 'http://localhost:3000/api/v1/dogs';
		url = (dogID) ? `${url}/${dogID}` : url;
		return axios(url, {
			method: (dogID) ? 'PUT' : 'POST',
			headers: {
				Authorization: `Bearer ${accessToken.token}`
			},
			data: jsonToForm(values)
		});
	}

	const { mutate } = useMutation(postOrPutDog, {
		onSuccess: () => form.resetFields(),
		onError: () => message.error('You can not add/update this dog')
	});

	/**
	 * Capitilises the first letter of a string only
	 * @param {string} string - The string to be capitilised
	 * @returns A string with the 1st letter capitilised
	 */
	function capitalise(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const breedList = [];
	if (breedsSuccess) {
		// eslint-disable-next-line no-restricted-syntax
		for (const [key, breed] of Object.entries(breeds)) {
			const children = breed.map((child) => ({
				title: `${capitalise(child)} ${capitalise(key)}`,
				value: `${capitalise(child)} ${capitalise(key)}`
			}));
			const treeNode = {
				title: capitalise(key),
				value: capitalise(key),
				children
			};
			breedList.push(treeNode);
		}
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
				{shelterSuccess && (
					<PageHeader
						className="site-page-header"
						title={(dogID) ? "Update a dog's details"
							: `Add a dog to ${shelter.name} Shelter`}
						subTitle="Let's get them a home"
					/>
				)}

				<Form {...formItemLayout} form={form} onFinish={mutate}>
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
							onSelect={handleSelect}
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
			{(dogImgURlSuccess) && (
				<Layout.Sider style={{ background: 'white' }} width={400}>
					<PageHeader
						className="site-page-header"
						title={`${capitalise(form.getFieldValue('breed') || '')}`}
						subTitle="Example image"
					/>
					<img src={dogImgURL} alt="dog" width={400} />
				</Layout.Sider>
			)}
		</Layout>
	);
}

export default DogForm;
