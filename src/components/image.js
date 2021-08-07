import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import axios from 'axios';

/**
 * Component that fetches an image from the API using the imageID
 */
function Image(props) {
	const {
		ID, alt, style, onClick
	} = props;

	function fetchImage({ queryKey }) {
		const [_key, imageID] = queryKey;
		return axios(`http://localhost:3000/api/v1/images/${imageID}`, {
			responseType: 'blob'
		}).then((response) => URL.createObjectURL(response.data));
	}

	const { data } = useQuery(['image', ID], fetchImage, {
		onError: ((error) => console.error(error, `Error fetching image ID: ${ID}`))
	});

	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<img
			src={data}
			alt={alt}
			style={style}
			onClick={onClick}
			onKeyPress={onClick}
		/>
	);
}

Image.propTypes = {
	/** Image ID */
	ID: PropTypes.number.isRequired,
	/** Alt text for image */
	alt: PropTypes.string.isRequired,
	/** CSS style for image */
	style: PropTypes.object,
	/** onClick handler from parent component */
	onClick: PropTypes.func
};
Image.defaultProps = {
	style: {},
	onClick: (() => null)
};

export default Image;
