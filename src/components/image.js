import React from 'react';
import PropTypes from 'prop-types';
import { json, status } from '../utilities/requestHandlers.js';

class Image extends React.Component {
	constructor(props) {
		super(props);
		this.state = { image: null };
	}

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
		const { alt, style } = this.props;
		return (
			<img src={image} alt={alt} style={style} />
		);
	}
}

Image.propTypes = {
	ID: PropTypes.number.isRequired,
	alt: PropTypes.string.isRequired,
	style: PropTypes.object
};
Image.defaultProps = {
	style: {}
};

export default Image;
