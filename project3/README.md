# Project 3 
Primary task of this project is 

(1) Lets anyone read blogs written by our users through <u>public URLs</u>.

(2) Lets our registered users create and update their own blogs after <u>password authentication.</u> 

http://oak.cs.ucla.edu/classes/cs144/project3/

run `mongo < db.sh`
run `npm install` to install modules need.
run `npm start` and go to http://localhost:3000/

# Development Environment

Create a container based on the “junghoo/cs144-mean” image:

```dockerfile
$ docker run -it -p3000:3000 -p4200:4200 -v /Users/rickyoung/documents/cs144:/home/cs144/shared --name mean junghoo/cs144-mean
```

run the container:

```
docker start -i mean
docker stop mean
```

This container has MongoDB (v4.2.5), NodeJS (v12.16.2), Express application generator (v4.16.1), and Angular CLI (v9.1.1) pre-installed. Make sure that they run fine through the following commands:

```
$ mongo --version
$ node --version
$ express --version
$ ng --version
```
