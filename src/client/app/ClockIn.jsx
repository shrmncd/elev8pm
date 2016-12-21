import React from 'react';
import {render} from 'react-dom';

class ClockIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			githubHandle: '',
			distance: Infinity
		};
		
		this.handleInputEntry = this.handleInputEntry.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
		this.handleGeoLocate = this.handleGeoLocate.bind(this);
		this.distance = this.distance.bind(this);
	}

	handleInputEntry(event) {
		const update = {};
		update[event.currentTarget.name] = event.target.value;
		this.setState(update);
	}

	handleGeoLocate() {
		this.props.httpRequest('post', 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBeV-rxZt9mVwNxeXLK_PBvpBkfy31kh2w', null, (error, data) => {
			console.log("Geolocate data: ", data);
		});

		/** Converts numeric degrees to radians */
		if (typeof(Number.prototype.toRad) === "undefined") {
		  Number.prototype.toRad = function() {
		    return this * Math.PI / 180;
		  }
		}

		console.log("Geo Location: ");
		window.navigator.geolocation.getCurrentPosition(function(pos) {
		  //console.log("POS IS: ", pos); 
		  this.setState({distance: this.distance(pos.coords.longitude, pos.coords.latitude, 33.9772162, -118.4221405)}); 
		}.bind(this));
	}

	distance(lon1, lat1, lon2, lat2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
	  var dLon = (lon2-lon1).toRad(); 
	  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
	          Math.sin(dLon/2) * Math.sin(dLon/2); 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}

	handleSignUp() {
		if (this.state.githubHandle) {
			this.props.httpRequest('post', '/nightshift/clock-in', 'githubHandle=' + this.state.githubHandle, (error, data) => {
				console.log("Daa: ", data);
				if (data.error) {
					console.log("Setting error");
					this.setState({heading: data.heading, message: data.error});
				} else {
					this.props.updateUser(data.nightowl);
				}
			});
		} else {
			this.setState({heading: 'Not impressed.'})
			this.setState({message: 'Be a good sport. Enter a github handle.'})
		}
	}

	render() {
		let message = <div className='message'><h2>Sign in, old chap.</h2><p>The lobby boy will be right with you.</p></div>;
		if (this.state.heading || this.state.heading) {
			message = <div className='message'><h2>{this.state.heading}</h2><p>{this.state.message}</p></div>;
		}
		if (this.state.distance < 15000) {
			return (
				<div className="sign-up-form">
					{message}
					<input name="githubHandle" placeholder='github handle' onChange={this.handleInputEntry}/>
					<button onClick={this.handleSignUp}>Clock In</button>
				</div>
			);
		} else {
			return (
				<div className='message'>
					<h2>Convince us you're downstairs...</h2>
					<p>Electricity is expensive. We don't operate the lift willy nilly.</p>
					<button className="geolocate" onClick={this.handleGeoLocate}>Geo Locate</button>
				</div>
			);
		}
	}
}

export default ClockIn;