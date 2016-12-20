import React from 'react';
import {render} from 'react-dom';
import ClockIn from './ClockIn.jsx';
import Elev8Services from './Elev8Services.jsx';

class Lobby extends React.Component {
	render() {
		if (this.props.nightowl) {
			return (
				<div className="concierge">
					<Elev8Services httpRequest={this.props.httpRequest}/>
				</div>
			);

		} else {
			return (
				<div className="concierge">
					<ClockIn httpRequest={this.props.httpRequest} updateUser={this.props.updateUser}/>
				</div>
			);
		}
	}
}

export default Lobby;