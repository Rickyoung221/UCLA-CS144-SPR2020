<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.util.ArrayList" %>
<!DOCTYPE html>
<html>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>List</title>
	<link rel="stylesheet" type="text/css" href="css/style.css"/>
<style>
table, td, th {
  border: 1px solid black;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  height: 50px;
}
</style>

        
    </head>

    <body>
        <div >
            <br><br>
            <div><h1>List</h1></div>
            <br><br>
            <div>
                <form id="0" method="post" action="/editor/post">
                    <div>
                        <input type="hidden" name="username" value='<%= request.getParameter("username") %>' />
                        <input type="hidden" name="postid" value='<%= request.getAttribute("postid") %>' />
                    </div>
                    <div>
                        <button  type="submit" name="action" value="open">New post</button>
                    </div>
                </form>
            </div>
            <br><br><br>
            <section class="text-center tableArea">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Created</th> 
                            <th>Modified</th>
                            <th>&nbsp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% ArrayList records = (ArrayList)request.getAttribute("list"); %>
                            <% for (int i = 0; records != null && i < records.size(); i++) { %>
                            <% ArrayList record = (ArrayList)records.get(i); %>
                            <tr>
                                <td><%= record.get(0) %></td>
                                <td><%= record.get(1) %></td>
                                <td><%= record.get(2) %></td>
                                <td>
                                    <form id='<%= i+1 %>' method="post" action="/editor/post">
                                        <div>
                                            <input type="hidden" name="username" value='<%= request.getParameter("username") %>' />
                                            <input type="hidden" name="postid" value='<%= record.get(3) %>' />
                                        </div>
                                        <div>
                                            <button  type="submit" name="action" value="open">Open</button>
                                            <button  type="submit" name="action" value="delete">Delete</button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        <% } %>
                    </tbody>
                </table>
            </section>
        </div>
    </body>
	</html>
