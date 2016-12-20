import React from 'react';
import {render} from 'react-dom';
import Lobby from './Lobby.jsx';
import ClockOut from './ClockOut.jsx';


class App extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			nightowl: "",
			action: "concierge"
		}

		this.updateUser = this.updateUser.bind(this);
	}

	httpRequest(method, url, data, callback) {
		let xhttp = new XMLHttpRequest();
		let params = "";
		if (data) {
			params = data;
		}
		method = method.toLowerCase();

		xhttp.open(method, url, true);

		if (method === "getting") {	
			console.log("Posting...", url, data, callback);
			xhttp.setRequestHeader("Content-type", "application/json");
		}

		if (method === "post") {	
			console.log("Posting...", callback);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}

		xhttp.onreadystatechange = () => {
		    if (xhttp.status == 200 && xhttp.readyState == 4) {
		        console.log(xhttp.responseText);
		        console.log("Response Text: ", xhttp.responseText);
		        callback(null, JSON.parse(xhttp.responseText));
		    }

		    if (xhttp.status == 400 || xhttp.status == 500) {
		    	callback(url + " could not be reached");
		    }
		}

		xhttp.send(params);
	}

	updateUser(user) {
		this.setState({nightowl: user});
	}

	componentDidMount() {
		this.httpRequest('get', '/nightshift/status', null, (error, data) => {
			console.log(data);
			if (data.nightowl !== "undefined") {
				console.log("kaw");
				this.setState({nightowl: data.nightowl});
			} else {
				console.log("clock in");
			}
		});
	}

	render() {
		let logoutButton = "";
		let currentUser = "";
		if (this.state.nightowl) {
			currentUser = <div className="user">{this.state.nightowl}</div>;
			logoutButton = <ClockOut httpRequest={this.httpRequest} updateUser={this.updateUser}/>;
		}

		return (
			<div className="location">
				{currentUser}
				{logoutButton}
				<Lobby nightowl={this.state.nightowl} httpRequest={this.httpRequest} updateUser={this.updateUser}/>
			</div>
		);
	}
}

render(<App/>, document.getElementById('app'));