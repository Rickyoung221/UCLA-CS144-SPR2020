<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Post</title>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
	<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
</head>
<body>
    <div><h1>Edit Post</h1></div>
    <form action="/editor/post" method="post">
		<div>
        <input type = "hidden" name = "username"  value = '<%= request.getParameter("username") %>'>
        <input type = "hidden" name = "postid" value = '<%= request.getParameter("postid") %>'  >
		</div>
		
		<div>
            <button type="submit" name="action" value="save">Save</button>
            <button type="submit" name="action" value="list">Close</button>
            <button type="submit" name="action" value="preview">Preview</button>
            <button type="submit" name="action" value="delete">Delete</button>

        </div>
		
            <br><br><div>
            <label for="title">Title</label><br>
            <input type="text" name="title" placeholder="Please enter your title.." value="<%= request.getAttribute("title") %>">
        </div>
        <br>
        <div>
            <label for="body">Body</label><br>
	     <textarea style="height: 20rem;" id="body" name="body" placeholder="Please enter your story.."><%= request.getAttribute("body")%></textarea>
        </div>
    </form>
</body>
</html>

