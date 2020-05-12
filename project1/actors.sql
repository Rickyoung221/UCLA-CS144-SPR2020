CREATE TABLE Actors (name varchar(40), movie varchar(80), year int, role varchar(40));

LOAD DATA LOCAL INFILE './actors.csv' INTO TABLE Actors
    FIELDS TERMINATED BY ','
    OPTIONALLY ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;

SELECT name FROM Actors WHERE movie LIKE 'Di%';

DROP TABLE Actors;
