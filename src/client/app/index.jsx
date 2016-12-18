import React from 'react';
import {render} from 'react-dom';
import Elev8Requests from './Elev8Requests.jsx'

class App extends React.Component {
	render() {
		return (
			<Elev8Requests/>
		);
	}
}

render(<App/>, document.getElementById('app'));