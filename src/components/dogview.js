import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
	Col, PageHeader, Row, Spin, Typography
} from 'antd';
import axios from 'axios';
import Image from './image.js';

/**
 * Dog details view component for user to get more info about a dog.
 */
function DogView() {
	const history = useHistory();
	const { dogID } = useParams();

	/**
	 * Fetch dog using ID from URL parameter.
	 */
	function fetchDog() {
		return axios(`http://localhost:3000/api/v1/dogs/${dogID}`)
			.then((response) => response.data)
			.catch((err) => console.error(err, `Error fetching single dog ID ${dogID}`));
	}

	const { data, isLoading, isSuccess } = useQuery(['dog', dogID], fetchDog);

	return (
		<Spin spinning={isLoading} size="large">
			{isSuccess && (
				<div style={{ padding: '0% 10% 1%', background: 'white' }}>
					<PageHeader
						className="site-page-header"
						title={`About ${data.name}`}
						subTitle="Learn more about them."
						onBack={() => history.goBack()}
					/>
					<Row>
						<Col span={12}>
							<Image ID={data.imageID} alt={data.breed} style={{ width: '550px' }} />
						</Col>
						<Col span={12}>
							<Typography.Title level={4}>Name</Typography.Title>
							<p>{data.name}</p>
							<Typography.Title level={4}>Age</Typography.Title>
							<p>{data.age}</p>
							<Typography.Title level={4}>Gender</Typography.Title>
							<p>{data.gender}</p>
							<Typography.Title level={4}>Breed</Typography.Title>
							<p>{data.breed}</p>
							<Typography.Title level={4}>Description</Typography.Title>
							<p>{data.description}</p>
						</Col>
					</Row>
				</div>
			)}
		</Spin>
	);
}

export default DogView;
