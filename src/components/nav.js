import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom'

function Nav() {
	return (
		<Menu theme="dark" defaultSelectedKeys={['1']} mode="horizontal">
			<Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
		</Menu>
	);
}

export default Nav;