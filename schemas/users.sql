CREATE TABLE IF NOT EXISTS users (
	user_id bigint NOT NULL AUTO_INCREMENT,
	username varchar(128) NOT NULL,
	password varchar(255) NOT NULL,
	github_handle varchar(64) NOT NULL,
	created_date datetime NOT NULL,
	last_login_date datetime NOT NULL,
	PRIMARY KEY (user_id)
);