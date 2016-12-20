import React, {PropTypes} from 'react';

/* Once you call lift, messages sent are take out of lobby */

const CallLift = ({httpRequest}) => {
	const handleCallLift = () => {
		httpRequest('get', '/hey-franz/lift-please', null, (error, data) => {
		});
	}

	return (
		<div className="call-lift">
			<button onClick={handleCallLift}>Call Lift</button>
		</div>
	);
};

export default CallLift;