import React from 'react';
import {render} from 'react-dom';

class Elev8Requests extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			requests: [],
			bells: []
		};

		this.buildRequests = this.buildRequests.bind(this);

		this.getElev8Requests();
	}

	buildRequests(requests) {
		if (requests) {
			this.setState({requests: requests});
		}
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
		        //console.log(xhttp.responseText);
		        //console.log("Response Text: ", xhttp.responseText);
		        callback(null, JSON.parse(xhttp.responseText));
		    }

		    if (xhttp.status == 400 || xhttp.status == 500) {
		    	callback(url + " could not be reached");
		    }
		}

		xhttp.send(params);
	}

	turnOffBell() {
		console.log("Turning bell off");
		this.httpRequest('get', '/hey-franz/turn-off-bell', null, (error, data) => {});
		document.getElementById('bell').innerHTML = '';
		document.getElementById('silence-button').style.display = 'none';
	}

	getElev8Requests() {
		this.httpRequest('get', '/timely-requests', null, (error, data) => {
			console.log("Requests: ", data.length);
			if (data.length) {
				this.httpRequest('get', '/hey-franz/is-bell-ringing-perchance', null, (error, data) => {
					console.log("Ringing? ", data);
					if (!data.bellIsRinging) {
						
					} else {
						if (!document.getElementById('bell').innerHTML) {
							this.httpRequest('get', '/hey-franz/ring-the-bell', null, (error, data) => {
								document.getElementById('bell').innerHTML = '<iframe width="0" height="0" src="https://www.youtube.com/embed/KOnz2IKJxXk?autoplay=1"></iframe>';
								document.getElementById('silence-button').style.display = 'block';
								setTimeout(this.turnOffBell.bind(this), 60000);
								console.log("Bell is still ringing from last request");
							});
						}
							
					}
				});
			}
			/*
			this.httpRequest('get', '/hey-franz/ring-the-bell', null, (error, data) => {
				setTimeout((data) => {
					//turn off the bell after 30 seconds
					document.getElementById('bell').innerHTML = '';
					document.getElementById('silence-button').style.display = 'none';
					console.log("After time out: ", data);
				}, 30000);
				if (data.bell === "ring") {
					document.getElementById('bell').innerHTML = '<iframe width="0" height="0" src="https://www.youtube.com/embed/KOnz2IKJxXk?autoplay=1"></iframe>';
					document.getElementById('silence-button').style.display = 'block';
				}
			});
			*/
		});
	}

	componentDidMount() {
		setInterval(() => {
			this.getElev8Requests();
		}, 4000);
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