import React, {PropTypes} from 'react';

const ClockOut = ({httpRequest,updateUser}) => {
	const handleSignOut = () => {
		httpRequest('get', '/nightshift/clock-out', null, (error, data) => {
			updateUser('');
		});
	}

	return (
		<button className="signout-button" onClick={handleSignOut}>Sign out</button>
	);
};

export default ClockOut;