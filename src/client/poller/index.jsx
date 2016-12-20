import React from 'react';
import {render} from 'react-dom';
import Elev8Requests from './Elev8Requests.jsx';


class Poller extends React.Component {
	render() {
		return (
			<div>
				Welcome to the Lobby
				<Elev8Requests/>
			</div>
		);
	}
}

render(<Poller/>, document.getElementById('poller'));