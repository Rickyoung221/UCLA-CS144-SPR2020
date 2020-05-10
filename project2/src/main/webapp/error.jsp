  
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<link rel="stylesheet" type="text/css" href="css/style.css"/>
<!DOCTYPE html>
<html>

    <head>
        <meta charset="UTF-8">
        <title> Invalid Request </title>


    </head>

    <body>
        <div><h1>Error</h1></div>
        <div><h3>Error Message</h3></div>
        <div><%= request.getAttribute("msg") %></div><br>
        <div><h3>Request Info</h3></div>
        <div><b>action:</b> <%= request.getParameter("action") %> </div>
        <div><b>username:</b> <%= request.getParameter("username") %></div>
        <div><b>postid:</b> <%= request.getParameter("postid") %></div>
        <div><b>title:</b> <%= request.getParameter("title") %></div>
        <div><b>body:</b> <%= request.getParameter("body") %></div>

    </body>

</html>
