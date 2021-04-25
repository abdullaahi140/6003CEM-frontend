import React from 'react';
import { PageHeader } from 'antd';
import { withRouter } from 'react-router-dom';
import UserContext from '../contexts/user.js';
import { json, status } from '../utilities/requestHandlers.js';
import DogGrid from './doggrid.js';

class Favourite extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dogs: [],
			loading: true
		};
	}

	componentDidMount() {
		const { user } = this.context;
		fetch('http://localhost:3000/api/v1/dogs/favs', {
			headers: {
				Authorization: `Bearer ${user.accessToken}`
			}
		})
			.then(status)
			.then(json)
			.then((data) => {
				this.setState({ dogs: data, loading: false });
			})
			.catch((err) => {
				this.setState({ dogs: [] });
				console.error(err, 'Error fetching dogs');
			});
	}

	render() {
		const { dogs, loading } = this.state;
		return (
			<div className="site-layout-content">
				<div style={{ padding: '0% 10% 1%', textAlign: 'center' }}>
					<PageHeader
						style={{ padding: '0% 0% 1%' }}
						className="site-page-header"
						title="Favourite Dogs"
						subTitle="Browse through the list and adopt a dog."
					/>
				</div>
				<DogGrid dogs={dogs} loading={loading} />
			</div>
		);
	}
}

Favourite.contextType = UserContext;

export default withRouter(Favourite);
