# Project note for myself
Project Requirement: http://oak.cs.ucla.edu/classes/cs144/project1/index.html

# Project 1

## Docker

![docker-tutorial-image-2](/Users/rickyoung/Library/Mobile Documents/com~apple~CloudDocs/Class_Note/CS144 SPRING20/Project.assets/image2_0.png)

### Definition

- Docker image

  A Docker image is like an OS installation package

- Docker container

  A Docker container is like an actual system that is setup using the image

>  Just like you can set up multiple machines using one OS installation package, it is possible to create multiple containers using one Docker image.

- *shared folder* and *port forwarding*
- Docker Engine is a client-server application with these major components:
  - The Docker daemon is a service that runs on your host operating system. When you type any docker command, it is interpreted by the demon and it takes necessary actions.
  - A REST API to talk to the daemon and instruct it what to do.
  - A command line interface (CLI) client (the docker command).

```dockerfile
$ docker run -it hello-world
```

### Basic concept

:star: Docker performed the following sequence of operations.

1. It first downloaded the Docker image named “hello-world” over the Internet from the *Docker Hub* and saved it locally. *Docker Hub* is the default location from which Docker images are downloaded.
2. It then created a *Docker container* based on the downloaded image.
3. Finally, it started running the container, displaying any output from the container on terminal.

---

Commands:

The `docker image ls` command shows all Docker images that have been saved locally. In this example, we have the “hello-world” image that was downloaded from our earlier `docker run ...` command.

```dockerfile
$ docker image ls
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hello-world         latest              fce289e99eb9        15 months ago       1.84kB
```

The `docker container ls -a` command shows **all Docker containers** that have been created. Whenever Docker creates a new container, it assigns a unique random name so that the user can refer to the container using the name in future commands.

```docker
$ docker container ls -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
5a9e70c99436        hello-world         "/hello"            9 minutes ago       Exited (0) 9 minutes ago                        ecstatic_diffie
6c5c3203bcd3        hello-world         "/hello"            12 minutes ago      Exited (0) 12 minutes ago 
```

If just want to see only the currently-running containers. just run `docker container ls` command without `-a` (`-a` means all)

## Shared Folder and Port Forwarding

In using Docker containers, there are two more important concepts that you will need to know: *shared folder* and *port forwarding*.

To learn about these concepts, first, create a directory on your computer where you plan to do project development. In this tutorial, we will assume to use `/Users/cho/cs144` as such a directory.

Then execute the following command after replacing `{your_shared_dir}` with your directory name (i.e., `/Users/cho/cs144/`):

```
$ docker run -it -v {your_shared_dir}:/home/cs144/shared -p 8888:8080 --name tomcat junghoo/cs144-tomcat 
```

This command will ask Docker to perform the following actions:

1. *Image name*: From Docker Hub, download and save the image “junghoo/cs144-tomcat”.
2. *Container name*: Create a container from the downloaded image and name it “tomcat” (the `--name tomcat` option).
3. *Shared folder*: “Mount” the `{your_shared_dir}` (i.e., `/Users/cho/cs144/`) directory on your host machine at the `/home/cs144/shared` directory in the container Any file you place in the `/Users/cho/cs144` directory on your host machine will be available in the `/home/cs144/shared` directory of the container, and vice versa.
4. *Port forwarding*: Forward any network request to port 8888 on the host machine to the port 8080 on the container (the `-p 8888:8080` option).
5. *Interactive terminal*: Allocate a pseudo terminal in the container (`-t` option) and connect it to the interactive terminal window of the host (`-i` option).

Run the container

```
$ docker start -i tomcat
```

tomcat is the container name

Quit:

```
$ docker stop tomcat
```





## MySQl - Basic

http://oak.cs.ucla.edu/classes/cs144/mysql/index.html

### Starting MySQL

```mysql
$ mysql
```

### Choosing a Databases

First select the database that will be using, by type `SHOW DATABASES`

```mysql
MariaDB [(none)]>  SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| CS144              |
| information_schema |
+--------------------+
2 rows in set (0.001 sec)
```

Here `information_schema` is a database that MySQL creates automatically and uses to maintain some internal statistics on datbases and tables.

The other database, `CS144`, is what we created for the project (note database names are *case-sensitive* in MySQL). Select the `CS144` database for the rest of this tutorial by issuing the command

```mysql
MariaDB [(none)]> USE CS144;
Database changed
MariaDB [CS144]> 
```

### Creating a Table

Once you select a database, you can execute any SQL command. For example, you can create a table using the `CREATE TABLE` command:

```mysql
     CREATE TABLE <tableName> (
         <list of attributes and their types>
     );
```

Note that all reserved keywords (like `CREATE` and `TABLE`) are *case-insensitive* and identifiers (like table names and attribute names) are *case-sensitive* in MySQL by default. That is, a table named `STUDENT` is different from the `student` table.

Table-creation command:

```mysql
 CREATE TABLE tbl(a int, b char(20));
```

```mysql
MariaDB [CS144]> CREATE TABLE tbl(a int, b char(20));
Query OK, 0 rows affected (0.037 sec)
```

This command creates a table named `tbl` with two attributes. The first, named `a`, is an integer, and the second, named `b`, is a character string of length (up to) 20.

When you create a table, you can declare a (set of) attribute(s) to be the primary key like:

```mysql
     CREATE TABLE <tableName> (..., a <type> PRIMARY KEY, b, ...);
```

or

```mysql
     CREATE TABLE <tableName> (<attrs and their types>, PRIMARY KEY(a,b,c));
```

### Inserting and Retrieving Tuples

Having created a table, we can insert tuples into it. The simplest way to insert is with the `INSERT` command:

```mysql
     INSERT INTO <tableName>
         VALUES( <list of values for attributes, in order> );
```

For instance, we can insert the tuple `(10, 'foobar')` into relation `tbl` by

```mysql
     INSERT INTO tbl VALUES(10, 'foobar');
```

```mysql
MariaDB [CS144]> INSERT INTO tbl VALUES(10, 'foobar');
Query OK, 1 row affected (0.006 sec)
```

Once tuples are inserted, we can see the tuples in a relation with the command:

```mysql
     SELECT * FROM <tableName>;
```

For instance, after the above create and insert statements, the command

```mysql
     SELECT * FROM tbl;
```

Produces the result:

```mysql
MariaDB [CS144]> SELECT * FROM tbl;
+------+--------+
| a    | b      |
+------+--------+
|   10 | foobar |
+------+--------+
1 row in set (0.004 sec)
```

### Creating Index

Having created a table, we can create an index on some attributes of the table. The command for creating an index is:

```mysql
     CREATE INDEX <indexName> ON <tableName>(<list of attributes>);
```

For instance, we can **create an index** on `b` attribute of table `tbl` by

```mysql
     CREATE INDEX IdxOnAttrB ON tbl(b);
```

Later, if you want to **drop an index**, you use the following command

```mysql
     DROP INDEX <indexName> ON <tableName>;
```

like

```mysql
     DROP INDEX IdxOnAttrB ON tbl;
```

Note that in MySQL, an index is automatically created on primary keys and unique attributes.

### Bulk Loading Data

Instead of inserting tuples one at a time, it is possible to create a file that contains all tuples that you want to load in batch. The command for bulking loading tuples from a file is the following:

```mysql
     LOAD DATA LOCAL INFILE <dataFile> INTO TABLE <tableName>;
```

### DROP Tables

To remove a table from your database, execute

```mysql
     DROP TABLE <tableName>;
```

We suggest you execute

```mysql
     DROP TABLE tbl;
```

after trying out the sequence of commands in this tutorial to avoid leaving a lot of garbage tables around.

### Get Inform of TABLES

You can get the set of all tables within the current database by the following command:

```mysql
     SHOW TABLES;
```

```MYSQL
MariaDB [CS144]> SHOW TABLES;   
+-----------------+
| Tables_in_CS144 |
+-----------------+
| tbl             |
+-----------------+
1 row in set (0.002 sec)
```

Once you know the list of tables, it is also possible to learn more about the table by issuing the command:

```mysql
     DESCRIBE <tableName>;
```

```mysql
MariaDB [CS144]> DESCRIBE tbl;
+-------+----------+------+-----+---------+-------+
| Field | Type     | Null | Key | Default | Extra |
+-------+----------+------+-----+---------+-------+
| a     | int(11)  | YES  |     | NULL    |       |
| b     | char(20) | YES  |     | NULL    |       |
+-------+----------+------+-----+---------+-------+
2 rows in set (0.008 sec)
```

### Executing SQL From a File

Instead of typing and running SQL commands at a terminal, it is often more convenient to type the SQL command(s) into a file and cause the file to be executed.

To run the commands in `foo.sql` (in the current working directory), type:

```mysql
     SOURCE foo.sql;
```

in `mysql`. Files like `foo.sql` that have SQL commands to be executed are often referred to as a (batch) script file. You can also execute the script file directly from the Unix shell by redirecting the input to `mysql` like the following:

```mysql
$ mysql CS144 < foo.sql
```

Again, pay attention to the CR/LF issue if your host OS is windows and if you create your SQL batch script file from Windows. Run `dos2unix` on the file if necessary.

### Recording MySQL Session In a File

`mysql` provides the command `TEE` to save the queries that you executed and their results to a file. At the `mysql>` prompt, you say:

```mysql
     TEE foo.txt;
```

and a file called `foo.txt` will appear in your current directory and will record all user input and system output, until you exit `mysql` or type:

```mysql
     NOTEE;
```

Note that if the file `foo.txt` existed previously, new output will be appended to the file.

### Quitting `mysql`

To leave `mysql`, type

```mysql
     QUIT;
```

---

## JAVA

![Files IO](https://www.tutorialspoint.com/java/images/file_io.jpg)

## Assignment

### PART B

1. Create a table called “Actors” in the database “CS144”. The “Actors” table should have the following schema:

```mysql
Actors(name:VARCHAR(40), movie:VARCHAR(80), year:INTEGER, role:VARCHAR(40))
```

Note: `varchar` [ ( *n* | **max** ) ] Variable-size string data. Use *n* to define the string size in bytes and can be a value from 1 through 8,000 or use **max** to indicate a column constraint size up to a maximum storage of 2^31-1 bytes (2 GB).

```mysql
CREATE TABLE Actors (name VARCHAR(40), movie VARCHAR(80), year INT, role VARCHAR(40));
```

We created a table named “Actors”, with 4 columns

Check,

```mysql
MariaDB [CS144]> DESCRIBE Actors;               
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(40) | YES  |     | NULL    |       |
| movie | varchar(80) | YES  |     | NULL    |       |
| year  | int(11)     | YES  |     | NULL    |       |
| role  | varchar(40) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
4 rows in set (0.001 sec)
```

2. Load the downloaded `./actors.csv` file into the “Actors” table. Make sure that the double quotes enclosing some of the attributes in the data file are removed when they are loaded.

   ``` mysql
   MariaDB [CS144]> LOAD DATA LOCAL INFILE './actors.csv' INTO TABLE Actors
       FIELDS TERMINATED BY ',' 
       OPTIONALLY ENCLOSED BY '"'
       LINES TERMINATED BY '\n'
       IGNORE 1 ROWS;
   ```

   Note：`LOCAL` and  `FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY ‘“‘;` is need.

   > - The LOCAL keyword affects where the file is expected to be found. The file is read by the client program on the client host and sent to the server. If LOCAL is not specified, the file must be located on the server host and is read directly by the server.” [Reference manual](https://dev.mysql.com/doc/refman/5.7/en/load-data.html)
   > - Since the comma is the delimiter, we use the FIELDS TERMINATED BY ‘,’
   > - Each line of the CSV file is terminated by a newline character, thus we use LINES TERMINATED BY ‘\n’
   > - We already have the header in the MySQL table so we use IGNORE 1 ROWS

3. Retrieve some loaded data from the “Actors” table. In particular, write a query that returns the answer to this question: “Give me the names of all the actors in the movie ‘Die Another Day’.” Feel free to experiment with other interesting queries.

```mysql
SELECT name FROM Actors WHERE movie LIKE 'Di%';
```

To show name which contains movie beginning with Di:arrow_up:

https://dev.mysql.com/doc/mysql-tutorial-excerpt/5.7/en/pattern-matching.html

OR 

```mysql
SELECT name FROM Actors WHERE movie = 'Die Another Day';
```

4. Once you are done, drop the “Actors” table from MySQL, so that it will not stay in the database for our later project.



The .sql file:

```mysql
CREATE TABLE Actors (name varchar(40), movie varchar(80), year int, role varchar(40));

LOAD DATA LOCAL INFILE './actors.csv' INTO TABLE Actors
    FIELDS TERMINATED BY ','
    OPTIONALLY ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;

SELECT "The names of all the actors in the movie 'Die Another Day':";

SELECT name FROM Actors WHERE movie LIKE 'Di%';

DROP TABLE Actors;
```

```mysql
$ mysql -sN CS144 < actors.sql;
```

### Part C

#### SHA-1

SHA-1 is a <u>cryptographic one-way hash</u> （加密单向散列） function that computes a 160 bit value (or 40-digit hex value) from a sequence of bytes.

To calculate cryptographic hashing value in Java, **MessageDigest Class** is used, under the package **java.security**.



```
zip -q Project1.zip filename1 filename2 filename3
```

