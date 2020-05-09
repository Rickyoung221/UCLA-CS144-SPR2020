-- select database
USE CS144;

-- drop existing tables
DROP TABLE IF EXISTS Posts;

-- create table Posts
CREATE TABLE Posts(
  username	VARCHAR(40),
  postid	INTEGER,
  title		VARCHAR(100),
  body		TEXT,
  modified	TIMESTAMP DEFAULT '2000-01-01 00:00:00',
  created	TIMESTAMP DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY(username, postid)
);

INSERT INTO Posts Values
('user_XYRSAF', 1, 'Post 1 by XYRSAF', 'Article1 written by XYRSAF', '2020-01-03 10:00:00', '2020-01-03 09:10:00'),
('user_XYRSAF', 2, 'Post 2 by XYRSAF', 'Article2 written by XYRSAF', '2020-01-04 10:00:00', '2020-01-04 09:10:00'),
('user_XYRSAF', 3, 'Post 3 by XYRSAF', 'Article3 written by XYRSAF', '2020-01-05 10:00:00', '2020-01-05 09:10:00'),
('user_XYRSAF', 4, 'Post 4 by XYRSAF', 'Article4 written by XYRSAF', '2020-01-06 10:00:00', '2020-01-06 09:10:00'),
('user_ACHERW', 1, 'Post 1 by ACHERW', 'Article1 written by ACHERW', '2020-01-03 10:00:00', '2020-01-03 09:10:00'),
('user_ACHERW', 2, 'Post 2 by ACHERW', 'Article2 written by ACHERW', '2020-01-04 10:00:00', '2020-01-04 09:10:00');
