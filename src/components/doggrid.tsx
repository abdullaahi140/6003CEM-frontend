import React from 'react';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import DogCard from './dogcard';
import { Dog } from '../react-app-env';

interface Props {
	dogs: Dog[];
	loading: boolean;
}

/**
 * Functional component that takes a list of dogs and
 * returns a list grid of cards with the dog details in them.
 * @param {object} props - props from parent component with dogs objects
 * @returns A grid component with dog cards
 */
function DogGrid(props: Props): JSX.Element {
	const { dogs, loading } = props;
	const cardList = dogs ? dogs.map((dog) => (
		<div style={{ padding: '1rem' }} key={dog.ID}>
			<Col span={6}>
				<DogCard {...dog} loading={loading} />
			</Col>
		</div>
	)) : null;
	return (
		<>
			<Row justify="space-around">
				{cardList}
			</Row>
		</>
	);
}

DogGrid.propTypes = {
	/** List of dog objects */
	dogs: PropTypes.array.isRequired,
	/** Boolean for whether all dogs have been fetched */
	loading: PropTypes.bool.isRequired,
};

export default DogGrid;
