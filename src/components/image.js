import React from 'react';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';

/**
 * Component that fetches an image from the API using the imageID
 */
class Image extends React.Component {
	constructor(props) {
		super(props);
		this.state = { image: null };
	}

	/**
	 * Fetch the image from the API
	 */
	componentDidMount() {
		const { ID } = this.props;
		fetch(`http://localhost:3000/api/v1/images/${ID}`)
			.then(status)
			.then((res) => json(res, true))
			.then((data) => {
				this.setState({ image: URL.createObjectURL(data) });
			})
			.catch((err) => console.error(err, 'Error fetching image'));
	}

	render() {
		const { image } = this.state;
		const { alt, style, onClick } = this.props;
		return (
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
			<img src={image} alt={alt} style={style} onClick={onClick} onKeyPress={onClick} />
		);
	}
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
