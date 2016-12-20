import React from 'react';
import {render} from 'react-dom';

class ClockIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			githubHandle: '',
		};
		
		this.handleInputEntry = this.handleInputEntry.bind(this);
		this.handleSignUp = this.handleSignUp.bind(this);
	}

	handleInputEntry(event) {
		const update = {};
		update[event.currentTarget.name] = event.target.value;
		this.setState(update);
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
		return (
			<div className="sign-up-form">
				{message}
				<input name="githubHandle" placeholder='github handle' onChange={this.handleInputEntry}/>
				<button onClick={this.handleSignUp}>Clock In</button>
			</div>
		);
	}
}

export default ClockIn;