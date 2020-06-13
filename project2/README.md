## How to run
Hi!
Glad to see you.
After unzip the project, you can build it by:
`./deploy.sh`

After we deploy the files, we can access it through url:
for example:
http://localhost:8888/editor/post?action=open&username=user_XYRSAF&postid=1

And also you can access it by terminal:
for example:
Requesting http://localhost:8080/editor/post?action=open&username=user_XYRSAF&postid=1

Hoping you have a good time and stay healthy. 
----
# Project notes for myself
## Develop web app on container and MySQL.

### Part A: Web app on Apache Tomcat

Before starting to code, first learn how we develop a Web application using Apache Tomcat by going over our tutorial:

- [Developing a Web Application on Tomcat](http://oak.cs.ucla.edu/classes/cs144/tomcat/index.html).

#### Deploy web app

place the .war file in `$CATALINA_BASE/webapps` in your container. After deploying. Tomcat has created the `cs144` subdirectory (from the `cs144.war` file that we just copied). For efficiency reasons, when a new application archive is installed, Tomcat by default extracts and “caches” all the files in the archive into the subdirectory of the same name. This way, it can avoid reading the large `.war` file repeatedly to handle HTTP requests and read only the necessary files in the subdirectory.

#### Mapping an HTTP request to an application

Since a Tomcat server may host multiple .war files, it uses the *URL* of an HTTP request to determine which Web application should handle it. For example, an HTTP GET request for the the cs144 application we just deployed at http://localhost:8888/cs144/p1 would look something like:

```
GET /cs144/p1 HTTP/1.1
```

Since the *first URL path component* of this request is `cs144`, Tomcat determines that this request should be handled by `cs144.war` archive.

This URL returns the above configuration page, but you may have noticed that there is no `p1` file! The reason why there is no file named `p1` i<u>s because the page is generated dynamically by a Java class in the WAR file.</u>

#### Structure of a WAR file

This is where the *deployment descriptor* file comes in, located at `WEB-INF/web.xml` in the WAR file. This XML file is processed by Tomcat automatically when your Web application is deployed and describes the important “mapping” information between a URL and the Java class files. Now open the `WEB-INF/web.xml` file. You will see the following content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app id="cs144.config" version="2.4" xmlns="http://java.sun.com/xml/ns/j2ee">
    <display-name>CS144</display-name>
    <servlet>
        <servlet-name>P1Servlet</servlet-name>
        <servlet-class>ConfigurationTest</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>P1Servlet</servlet-name>
        <url-pattern>/p1</url-pattern>
    </servlet-mapping>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>
</web-app>
```

The important part is the <servlet> `` and `` <servlet-mapping> elements. The element  <servlet> names the Java class ConfigurationTest as “P1Servlet”. Then the element `` maps the servlet named “P1servlet” to the URL pattern /p1. Combined together, the two elements say that requests to the URL /p1 of this Web application should be handled by the Java classConfigurationTest. In a WAR file, all Java class files are placed in the **WEB-INF/classes/directory**, so Tomcat will search for \WEB-INF/classes/ConfigurationTest.class in the WAR file.

<div style="page-break-after:always;"></div>

#### Creating Your First Web Application Archive

Now that we understand the basic structure of a WAR file, we will be creating a very simple WAR file, called `simple.war`, that just contains a static “hello, world” type HTML page and the basic `web.xml` file. Here is a step-by-step instruction on how you can create a .war file. Our “tomcat” container has necessary JDKs preinstalled, follow these instructions inside the container.

1. Create a temporary folder to place all files that should go into the .war file. Make it as your current directory by `cd` into the directory.

2. Create a file named `hello.html` in your temporary directory with the following content.

   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Hello World</title></head>
   <body><h1>Hello World</h1></body>
   </html>
   ```

3. Create a `WEB-INF` folder and create the deployment descriptor file `web.xml` in it with the following content.

   ```xml
   <web-app id="simple" version="2.4">
       <welcome-file-list>
           <welcome-file>hello.html</welcome-file>
       </welcome-file-list>
   </web-app>
   ```

   This descriptor file will make the hello.html page as the “default page” that your application returns.



#### Adding a Java Servlet Class

##### What is a Servlet?

A Java servlet is a program that runs on a Web Application server (such as Apache Tomcat) and acts as a middle layer between a requests coming from a Web browser and databases or other applications running on the server. <u>Using a servlet, you can take input from users through HTML forms, perform complex data processing, and generate a Web page dynamically.</u>

More precisely, servlets perform the following tasks:

1. Read the HTTP request sent by a client (browser) and parse different parts of the requests, such as URL path, input parameters, HTTP cookies, etc.
2. Process the request and generate a response. Generating results may require retrieving data from a database and performing complex data-processing operations.
3. Send the response to the client (browser). This response can be in a variety of formats, including text (HTML or XML), binary (GIF images), etc.

#### Life Cycle of Servlet

A Java servlet is a Java class (based on the Java Servlet specification) that is run by a Web application server. A servlet is created by extending the [`javax.servlet.http.HttpServlet`](https://tomcat.apache.org/tomcat-8.0-doc/servletapi/javax/servlet/http/HttpServlet.html) class in the `javax.servlet` and `javax.servlet.http` packages.

A servlet life cycle can be defined as the entire process from its creation till the destruction. The following are the paths followed by a servlet.

- The servlet is initialized by calling the **init()** method.
- The servlet calls **service()** method to process a client's request.
- The servlet is terminated by calling the **destroy()** method.
- Finally, servlet is garbage collected by the garbage collector of the JVM.

A servlet’s *life cycle*, the entire process from its creation through its destruction, is roughly as follows:

1. After the Web application server starts, the servlet’s `init()` method is called.
2. When the application server receives an HTTP request that should be handled by the servlet, the corresponding `doGet()`, `doPost()`, `doPut()`, etc., method of the servlet is called.
3. Before the application server shuts down, the servlet’s `destroy()` method is called.
4. After the `destroy()` method call, the servlet is destructed and garbage collected.

The main task of any servlet is to generate a response to an HTTP request, so you will have to override one (or more) `doXXX()` methods (override `doGet()` to handle the `HTTP GET` method, for instance) when you implement your own servlet.

In addition, if your application needs to take certain initialization and clean-up actions, you will need to override the `init()` and `destroy()` methods, respectively. These methods are called *exactly once* at the beginning and the end of a servlet’s life cycle, respectively.

For your reference, here are the signatures of `init()`, `doGet()`, and `destroy()` methods of the `javax.servlet.http.HttpServlet` class:

```java
public void init() throws ServletException {
    // Initialization code...
}

public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    // The data from the request can be obtained from the request parameter
    // The response from your code should be written to the response parameter

    // Request handling code...
}

public void destroy() {
    // Finalization code...
}
```

### Part B: Learn JDBC

In order to access MySQL data from a Java program, use **JDBC (Java DataBase Connectivity) API**. Go over the following tutorial to learn how to use JDBC to access MySQL in a Java program.

- [A short tutorial on JDBC](http://oak.cs.ucla.edu/classes/cs144/jdbc/index.html)

Use the basic JDBC API to create tables, insert values, query tables, retrieve results, update tables, create prepared statements, perform transactions on a database system from a Java program.

#### Overview

Call-level interfaces such as JDBC are programming interfaces allowing e<u>xternal programs</u> to access SQL databases. They allow the execution of SQL commands within a general programming environment by providing library routines which interface with the database. In particular, Java-based JDBC has a rich collection of routines which make such an interface extremely simple and intuitive.

Here is an easy way of visualizing what happens in a call level interface: You are writing a normal Java program. Somewhere in the program, you need to interact with a database. 

- Using standard library routines, you open a connection to the database.
- You then use JDBC to send your SQL code to the database, and process the results that are returned. 
- When you are done, you close the connection. For your convenience, all of the code for this article is included in the [accessDatabase.java](http://oak.cs.ucla.edu/classes/cs144/jdbc/accessDatabase.java) file.

### Establish Connection

- **Load the vendor specific driver**

  Why would we need this step? To ensure portability and code reuse, the JDBC API was designed to be as independent of the version or the vendor of a database as possible. The differences between different DBMS’s are encapsulated by each DBMS’s driver, and we need to tell the Java DriverManager the correct driver to load. A MySQL driver is loaded using the following code:

  ```
  Class.forName("com.mysql.jdbc.Driver");
  ```

- **Make the connection**

  Once the driver is loaded and ready for a connection to be made, you may create an instance of a `Connection` object using:

  ```
  Connection con = DriverManager.getConnection(
      "jdbc:mysql://localhost:3306/DatabaseName", username, passwd
  );
  ```

  Okay, let’s see what this jargon is. The first string is the URL for the database including the protocol (jdbc), the vendor (mysql), and the server port (//localhost:3306/) and your database instance name (DatabaseName). Of course, you need to replace DatabaseName with the name of your database. The username and passwd are your username and password, the same as you would enter into MySQL to access your account.

That’s it! The connection returned in the last step is an open connection which we will use to pass SQL statements to the database. In this code snippet, con is an open connection, and we will use it below.

#### Creating JDBC PreparedStatement

It is often safer or more efficient to use a `PreparedStatement` object for sending SQL statements to the DBMS, especially when the SQL statement needs to include input from users. The main feature which distinguishes it from its superclass `Statement` is that 

(1) it is given an SQL statement right when it is created and 

(2) the SQL statement can be parameterized, so that the same `PreparedStatement` can be repeatedly used for queries with different parameters that are provided by users.

`PreparedStatement`s are also created with a `Connection` method. The following snippet shows how to create a parameterized `PreparedStatement` with three input parameters:

```sql
PreparedStatement preparedStmt = con.prepareStatement(
    "UPDATE Sells SET price = ? WHERE bar = ? AND beer = ?"
);
```

This SQL statement is then sent to the DBMS *right away*, where it is compiled. The advantage offered is that if you need to use the same, or similar query with different parameters multiple times, the statement can be compiled and optimized by the DBMS *just once*. Contrast this with a use of a normal Statement where each use of the same SQL statement requires a compilation all over again.

Before we can execute a `PreparedStatement`, we need to supply values for the parameters. This can be done by calling one of the `setXXX` methods defined in the class `PreparedStatement`. Most often used methods are `setInt`, `setFloat`, `setDouble`, `setString` etc. You can set these values before each execution of the prepared statement.

Continuing the above example, we would write:

```sql
preparedStmt.setInt(1, 3);
preparedStmt.setString(2, "Bar Of Foo");
preparedStmt.setString(3, "BudLite");
```

Setting parameters *separately* from the main SQL statement by explicitly specifying the their types makes `PreparedStatement` much safer than plain `Statement` in terms of security. In fact, if you need to use a user input as part of your SQL statement, it is an industry-wide convention that you ***MUST\*** use `PreparedStatement`, not plain `Statement`, to protect your application against many attacks, such as [SQL injection](https://en.wikipedia.org/wiki/SQL_injection).

Once we finish plugging in the values of the parameters (as seen above), and we execute the statement by invoking the `executeUpdate` on it.

```
int n = preparedStmt.executeUpdate();
```

Similarly, if our `PreparedStatement` was created with a SQL SELECT statement, not an UPDATE statement, then we would execute such a statement by invoking the `executeQuery` on it, like the following:

```
ResultSet rs = preparedStmt.executeQuery();
```

---



```
$ mysql CS144;

```

http://oak.cs.ucla.edu/classes/cs144/mysql/index.html










## Feedback from Instructors
> GET action=open&username=testuser123&title=title&body=body, status code is not correct. GET action=open&postid=-1&title=title&body=body, status code is not correct. GET action=open&username=testuser123&postid=-1&title=title&body=body, No ID attribute. GET action=open&username=testuser123&postid=-1&title=&body=body, No ID attribute. GET action=open&username=testuser123&postid=-1&title=title&body=, No ID attribute. GET action=open&username=testuser123&postid=-1&body=body, behavior is not correct. GET action=open&username=testuser123&postid=-1&body=body, No ID attribute. GET action=open&username=testuser123&postid=-1&title=title, behavior is not correct. GET action=open&username=testuser123&postid=-1&title=title, No ID attribute. GET action=open&username=testuser123&postid=-1, behavior is not correct. GET action=open&username=testuser123&postid=-1, No ID attribute. POST action=open&username=testuser123&postid=-1&title=title&body=body, No ID attribute. GET action=open&username=user_XYRSAF&postid=1&title=Post 1 by XYRSAF&body=Article1 written by XYRSAF, No ID attribute. GET action=open&username=user_XYRSAF&postid=1, No ID attribute. GET action=save&username=user1&postid=-1&title=title&body=body, status code is not correct. GET action=delete&username=user_ACHERW&postid=1&title=Post 1 by ACHERW&body=Article1 written by ACHERW, status code is not correct.
