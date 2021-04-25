import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import DogCard from './dogcard.js';

function DogGrid(props) {
	const { dogs, loading } = props;
	const cardList = dogs.map((dog) => (
		<div style={{ padding: '1em' }} key={dog.ID}>
			<Col span={6}>
				<DogCard {...dog} loading={loading} />
			</Col>
		</div>
	));
	return (
		<>
			<Row type="flex" justify="space-around">
				{cardList}
			</Row>
		</>
	);
}

DogGrid.propTypes = {
	dogs: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired
};

export default DogGrid;
