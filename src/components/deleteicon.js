import React from 'react';
import DeleteFilled from '@ant-design/icons/DeleteFilled';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';

/**
 * Icon that handles deletion of a resource. Asks the user to confirm deletion
 * before going ahead.
 */
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
	/** Function from parent that deletes the resource */
	handleConfirm: PropTypes.func.isRequired
};

export default DeleteIcon;
