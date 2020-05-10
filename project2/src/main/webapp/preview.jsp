<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Preview Post</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css" />

<!--<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
<head>
  <body>
    <div >
      <form action="/editor/post" method="=post">
        <input type="hidden" name="username" value='<%= request.getParameter("username") %>'/>
        <input type="hidden" name="postid" value='<%= request.getParameter("postid") %>'/>
        <input type="hidden" name="title" value='<%= request.getAttribute("title") %>'>
        <input type="hidden" name="body" value='<%= request.getAttribute("body") %>'>
	</div>

	
      
    <div>  
    <button type="submit" name="action" value="open">Close Preview</button>
	<!--<input type=button onClick="parent.location='/editor/post' " value='Close Preview'>-->
    </div>
	</form>
    <div>
      <h1 id="title"><p><%= request.getAttribute("titleContent") %></p></h1>
      <div id="preview"><p><%= request.getAttribute("bodyContent") %></p></div>
    </div>
  </body>
</html>
