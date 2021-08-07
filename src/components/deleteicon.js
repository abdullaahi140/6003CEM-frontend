import React, { useState } from 'react';
import DeleteFilled from '@ant-design/icons/DeleteFilled';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';

/**
 * Icon that handles deletion of a resource. Asks the user to confirm deletion
 * before going ahead.
 */
function DeleteIcon(props) {
	const [hover, setHover] = useState(false);
	const { handleConfirm } = props;
	const Icon = (hover) ? DeleteFilled : DeleteOutlined;

	return (
		<Popconfirm
			title="Are you sure？"
			icon={(<QuestionCircleOutlined style={{ color: 'red' }} />)}
			onConfirm={handleConfirm}
		>
			<Icon
				style={{ color: 'red' }}
				onMouseOver={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			/>
		</Popconfirm>
	);
}

DeleteIcon.propTypes = {
	/** Function from parent that deletes the resource */
	handleConfirm: PropTypes.func.isRequired
};

export default DeleteIcon;
