import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
	Col, PageHeader, Row, Spin, Typography,
} from 'antd';
import axios from 'axios';
import Image from './image';

/**
 * Dog details view component for user to get more info about a dog.
 */
function DogView(): JSX.Element {
	const history = useHistory();
	const { dogID } = useParams<{ dogID: string }>();

	/**
	 * Fetch dog using ID from URL parameter.
	 */
	function fetchDog() {
		return axios(`${process.env.REACT_APP_API_URL}/api/v1/dogs/${dogID}`)
			.then((response) => response.data)
			.catch((err) => console.error(err, `Error fetching single dog ID ${dogID}`));
	}

	const { data, isLoading, isSuccess } = useQuery(['dog', dogID], fetchDog);

	return (
		<Spin spinning={isLoading} size="large">
			{isSuccess && (
				<div style={{ padding: '0% 5% 1%', background: 'white' }}>
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
