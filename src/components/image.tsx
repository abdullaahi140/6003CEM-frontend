import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';

interface ImageProps {
	ID: number;
	alt: string;
	style?: CSSProperties | undefined;
	onClick?: () => void | null;

}

/**
 * Component that fetches an image from the API using the imageID
 */
function Image(props: ImageProps): JSX.Element {
	const {
		ID, alt, style, onClick,
	} = props;

	function fetchImage(imageID: number) {
		return axios(`${process.env.REACT_APP_API_URL}/api/v1/images/${imageID}`, {
			responseType: 'blob',
		}).then((response) => URL.createObjectURL(response.data));
	}

	const { data } = useQuery<string, AxiosError>(
		['image', ID],
		() => fetchImage(ID), {
			onError: ((error) => console.error(error, `Error fetching image ID: ${ID}`)),
		});

	return (
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
	onClick: PropTypes.func,
};
Image.defaultProps = {
	style: {},
	onClick: (() => null),
};

export default Image;
