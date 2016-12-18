import React from 'react';
import {render} from 'react-dom';

class Elev8Requests extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			requests: []
		};

		this.buildRequests = this.buildRequests.bind(this);

		this.getElev8Requests();
	}

	buildRequests(requests) {
		this.setState({requests: requests});
	}

	getElev8Requests() {
		console.log("Franz - time to get to work!");
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = ((xhttp, build) => {
			return () => {
			    if (xhttp.status == 200 && xhttp.readyState == 4) {
			       var requests = JSON.parse(xhttp.responseText);
			       build(requests);
			    }
			}			
		})(xhttp, this.buildRequests);
		xhttp.open("get", "http://localhost:3000/timely-requests", true);
		xhttp.send();
	}

	render() {
		const requests = this.state.requests.map((request, i) => {
			return <li key={i}>{request.message}</li>;
		});
		return (
			<ul className="elev8-requests">
				{requests}
			</ul>
		);
	}
}

export default Elev8Requests;