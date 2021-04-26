import React from 'react';
import PropTypes from 'prop-types';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import UserContext from '../contexts/user.js';
import { json, status } from '../utilities/requestHandlers.js';

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

	handleClick() {
		const { favourite } = this.state;
		if (favourite) {
			this.fetchFav('DELETE');
		} else {
			this.fetchFav('POST');
		}
	}

	fetchFav(method) {
		const { user } = this.context;
		const { dogID } = this.props;
		fetch(`http://localhost:3000/api/v1/dogs/favs/${dogID}`, {
			method,
			headers: {
				Authorization: `Bearer ${user.accessToken}`
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
	dogID: PropTypes.number.isRequired
};

export default FavIcon;
