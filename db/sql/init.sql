USE challenge;

CREATE TABLE users(
  ID integer NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL UNIQUE,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ID)
);

CREATE TABLE channels(
  ID integer NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ID)
);

CREATE TABLE messages(
  ID integer NOT NULL AUTO_INCREMENT,
  body varchar(255) NOT NULL,
  author_id integer NOT NULL,
  channel_id integer NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ID),
  FOREIGN KEY (author_id) REFERENCES users(ID),
  FOREIGN KEY (channel_ID) REFERENCES channels(ID)
);

CREATE INDEX message_user ON messages (author_id);
CREATE INDEX message_channel ON messages (channel_id);
