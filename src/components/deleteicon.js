import React from 'react';
import { DeleteFilled, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';

class DeleteIcon extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hover: false };
	}

	render() {
		const { hover } = this.state;
		const { handleConfirm } = this.props;
		const Icon = (hover) ? DeleteFilled : DeleteOutlined;
		return (
			<Popconfirm
				title="Are you sure？"
				icon={(<QuestionCircleOutlined style={{ color: 'red' }} />)}
				onConfirm={handleConfirm}
			>
				<Icon
					style={{ color: 'red' }}
					onMouseOver={() => this.setState({ hover: true })}
					onMouseLeave={() => this.setState({ hover: false })}
				/>
			</Popconfirm>
		);
	}
}

DeleteIcon.propTypes = {
	handleConfirm: PropTypes.func.isRequired
};

export default DeleteIcon;
