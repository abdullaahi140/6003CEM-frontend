import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import Nav from './components/nav.js';
import Home from './components/home.js';

const { Header, Content, Footer } = Layout;

class App extends React.Component {
	render() {
		return (
			<Router>
				<Header>
					<Nav />
				</Header>

				<Content>
					<Switch>
						<Route path='/' component={Home} />
					</Switch>
				</Content>

				<Footer style={{ textAlign: 'center' }}>6003 CEM CW2</Footer>
			</Router>
		)
	}
}

export default App;