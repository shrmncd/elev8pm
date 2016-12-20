import React, {PropTypes} from 'react';
import MessagePanel from './MessagePanel.jsx';
import CallLift from './CallLift.jsx';

const Elev8Services = ({httpRequest}) => {
	return (
		<div className="elev8-services">
			<CallLift httpRequest={httpRequest}/>
		</div>
	);
};

export default Elev8Services;