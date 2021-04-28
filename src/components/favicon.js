import React from 'react';
import PropTypes from 'prop-types';
import HeartOutlined from '@ant-design/icons/HeartOutlined';
import HeartFilled from '@ant-design/icons/HeartFilled';
import UserContext from '../contexts/user.js';
import { json, status } from '../utilities/requestHandlers.js';

/**
 * Icon component handling favouriting dogs
 */
class FavIcon extends React.Component {
	constructor(props) {
		super(props);
		this.state = { favourite: false };
		this.fetchFav = this.fetchFav.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		this.fetchFav('GET');
	}

	/**
	 * Set fetch method depending on the state of the icon when clicked
	 * */
	handleClick() {
		const { favourite } = this.state;
		if (favourite) {
			this.fetchFav('DELETE');
		} else {
			this.fetchFav('POST');
		}
	}

	/**
	 * Function that adds or remove favourite for dog
	 * @param {string} method - HTTP method for request (POST, DELETE e.g.)
	 */
	fetchFav(method) {
		const { user } = this.context;
		const { dogID } = this.props;
		fetch(`https://source-modem-3000.codio-box.uk/api/v1/dogs/favs/${dogID}`, {
			method,
			headers: {
				Authorization: `Bearer ${user.accessToken.token}`
			}
		})
			.then(status)
			.then(json)
			.then(() => {
				if (method !== 'DELETE') {
					this.setState({ favourite: true });
				} else {
					this.setState({ favourite: false });
				}
			})
			.catch(() => {
				if (method !== 'DELETE') {
					this.setState({ favourite: false });
				} else {
					this.setState({ favourite: true });
				}
			});
	}

	render() {
		let Icon;
		let color;
		const { favourite } = this.state;
		if (favourite) {
			Icon = HeartFilled;
			color = 'red';
		} else {
			Icon = HeartOutlined;
			color = 'black';
		}
		return (
			<Icon style={{ color }} onClick={this.handleClick} />
		);
	}
}

FavIcon.contextType = UserContext;
FavIcon.propTypes = {
	/** Dog ID */
	dogID: PropTypes.number.isRequired
};

export default FavIcon;
