-- A script to make a fresh db
-- Please, be careful, as it drops all the current data

DROP DATABASE IF EXISTS photo_album;

CREATE DATABASE photo_album CHARACTER SET utf8 COLLATE utf8_general_ci;
USE photo_album;

GRANT USAGE ON *.* TO 'photo_album'@'localhost';
DROP USER 'photo_album'@'localhost';
CREATE USER 'photo_album'@localhost IDENTIFIED BY 'photo_album';
GRANT ALL ON TABLE photo_album.* TO 'photo_album'@'localhost';

-- Create tables for the login service

CREATE TABLE users(
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(32) NOT NULL UNIQUE,
	password VARCHAR(512) NOT NULL,
	enabled TINYINT NOT NULL DEFAULT 1,
	CONSTRAINT users_pk PRIMARY KEY (id)
) ENGINE='InnoDB';

CREATE TABLE roles(
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	CONSTRAINT roles_pk PRIMARY KEY (id)
) ENGINE='InnoDB';

CREATE TABLE roles_users(
	id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	role_id INT NOT NULL,
	CONSTRAINT roles_users_pk PRIMARY KEY (id),
	CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT role_id_fk FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE='InnoDB';

INSERT INTO users(username, password) VALUES ('user', 'user');
INSERT INTO users(username, password) VALUES ('admin', 'admin');

INSERT INTO roles(name) VALUES ('user');
INSERT INTO roles(name) VALUES ('admin');

INSERT INTO roles_users(user_id, role_id) VALUES (1, 1);
INSERT INTO roles_users(user_id, role_id) VALUES (2, 2);

-- Create entity tables

CREATE TABLE photos(
	id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	title VARCHAR(64) DEFAULT 'Untitled',
	filepath VARCHAR(256) NOT NULL,
	description TEXT,
	added_on TIMESTAMP DEFAULT NOW(),
	likes_count INT DEFAULT 0,
	CONSTRAINT photos_id PRIMARY KEY (id),
	CONSTRAINT photos_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE='InnoDB';

CREATE INDEX photos_title_idx ON photos(title);
CREATE INDEX photos_added_on_idx ON photos(added_on);
CREATE INDEX photos_likes_count_idx ON photos(likes_count);

CREATE TABLE likes(
	id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	photo_id INT NOT NULL,
	CONSTRAINT likes_id PRIMARY KEY (id),
	CONSTRAINT likes_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id),
	CONSTRAINT likes_photo_id_fk FOREIGN KEY (photo_id) REFERENCES photos(id)
) ENGINE='InnoDB';

DELIMITER $$

-- DROP TRIGGER IF EXISTS insert_likes_trigger

CREATE TRIGGER insert_likes_trigger
AFTER INSERT ON likes FOR EACH ROW
BEGIN
	UPDATE photos
	SET photos.likes_count = photos.likes_count + 1
	WHERE photos.id = NEW.photo_id;
END$$

CREATE TRIGGER delete_likes_trigger
AFTER DELETE ON likes FOR EACH ROW
BEGIN
	UPDATE photos
	SET photos.likes_count = GREATEST(0, photos.likes_count - 1)
	WHERE photos.id = OLD.photo_id;
END$$

DELIMITER ;

-- Insert some initial data

-- INSERT INTO photos(user_id, title, description, added_on)
-- VALUES (1, "Untitled", "No description", '2015-12-29');
-- INSERT INTO photos(user_id, title, description, added_on)
-- VALUES (1, "Untitled", "No description", '2015-11-20');
-- INSERT INTO photos(user_id, title, description, added_on)
-- VALUES (2, "Untitled", "No description", '2015-10-10');
