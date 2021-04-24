import React from 'react';
import { PageHeader } from 'antd';
import { withRouter } from 'react-router-dom';

// eslint-disable-next-line react/prefer-stateless-function
class Favourite extends React.Component {
	render() {
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
			</div>
		);
	}
}

export default withRouter(Favourite);
