import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import DogCard from './dogcard.js';

function DogGrid(props) {
	const { dogs, loading, updateParent } = props;
	const cardList = dogs.map((dog) => (
		<div style={{ padding: '1rem' }} key={dog.ID}>
			<Col span={6}>
				<DogCard {...dog} loading={loading} updateParent={updateParent} />
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
	loading: PropTypes.bool.isRequired,
	updateParent: PropTypes.func.isRequired
};

export default DogGrid;
