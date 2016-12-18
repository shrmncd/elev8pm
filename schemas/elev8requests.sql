CREATE TABLE IF NOT EXISTS elev8requests (
	elev8request_id bigint NOT NULL AUTO_INCREMENT,
	user_id bigint NOT NULL,
	message varchar(255) NOT NULL,
	request_time datetime NOT NULL,
	fulfillment_time datetime,
	PRIMARY KEY (elev8request_id)
);