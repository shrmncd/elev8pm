import React, {PropTypes} from 'react';

/* Once you call lift, messages sent are take out of lobby */

const CallLift = ({httpRequest}) => {
	const handleCallLift = () => {
		httpRequest('get', '/hey-franz/lift-please', null, (error, data) => {
			console.log("ID: ", data.id);
			setTimeout(() => {
				document.getElementById('app').style.display = 'block';
				document.body.classList.remove('calling-lift');
				document.body.classList.add('app');
			}, 4000);
			document.getElementById('app').style.display = 'none';
			document.body.classList.remove('app');
			document.body.classList.add('calling-lift');
		});
	}

	return (
		<div className="call-lift">
			<button onClick={handleCallLift}>Call Lift</button>
		</div>
	);
};

export default CallLift;