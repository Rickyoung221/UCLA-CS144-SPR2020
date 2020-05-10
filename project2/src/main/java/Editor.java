import java.io.IOException;
import java.io.PrintWriter;
import java.sql.* ;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.Date;
import java.text.SimpleDateFormat;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.RequestDispatcher;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;



public class Editor extends HttpServlet {

    private PreparedStatement selectState = null;
    private PreparedStatement selectUserstate = null;
    private PreparedStatement insertState = null;
    private PreparedStatement deleteState = null;
    private PreparedStatement updateState = null;
    private PreparedStatement getPostState = null;
    private Connection connection = null;
    public Editor() {}



    public void init() throws ServletException
    {
        try{
            Class.forName("com.mysql.jdbc.Driver");
        } catch(ClassNotFoundException ex) {
            System.err.println("ClassNotFoundException: " + ex.getMessage());
        }
        try {

            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");
            insertState = connection.prepareStatement("INSERT INTO Posts (username, postid, title, body, modified, created) VALUES (?, ?, ?, ?, ?, ?)");
            selectState = connection.prepareStatement("SELECT * FROM Posts where username = ? and postid = ?");
            selectUserstate = connection.prepareStatement("SELECT * FROM Posts where username = ? ORDER BY postid");
            updateState = connection.prepareStatement("UPDATE Posts SET title = ?, body = ?, modified = ? WHERE username = ? AND postid = ?");
            deleteState = connection.prepareStatement("DELETE FROM Posts WHERE username = ? AND postid = ?");
            getPostState = connection.prepareStatement("SELECT MAX(postid) FROM Posts where username = ?");

        } catch(SQLException ex) {
            System.err.println("SQLException: " + ex.getMessage());
        }
    }



    public void destroy()
    {
        try { selectState.close(); } catch (Exception ex) {}
        try { selectUserstate.close(); } catch (Exception ex) {}
        try { insertState.close(); } catch (Exception ex) {}
        try { deleteState.close(); } catch (Exception ex) {}
        try { updateState.close(); } catch (Exception ex) {}
        try { getPostState.close(); } catch (Exception ex) {}
        try { connection.close(); } catch (Exception ex) {}
    }



    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {



        try{
            String action = request.getParameter("action");
            if (action == null)
            {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
            if (action.equals("open")) {
                open(request, response);
            } else if (action.equals( "preview")) {
                preview(request, response);
            } else if (action.equals("list")) {
                list(request, response);
            } else if (action.equals("close")) {
                list(request, response);
            } else {
                throw new ServletException("Action is invalid: " + action);
            }
        } catch(ServletException ex) {
            request.setAttribute("msg", ex.getMessage());
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
    }



    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        try {
            String action = request.getParameter("action");
            if (action.equals("save"))
            {
                save(request, response);
            } else if (action.equals("delete")) {
                delete(request, response);
            } else if (action.equals("open")) {
                open(request, response);
            } else if (action.equals("preview")) {
                preview(request, response);
            } else if (action.equals("list")) {
                list(request, response);
            } else if (action.equals("close")){
                list(request, response);
            } else {
                throw new ServletException("Action is invalid: " + action);
            }
        } catch(ServletException ex) {
            request.setAttribute("msg", ex.getMessage());
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
    }



    public void open(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
         /* required parameters: username and postid */
            /* If postid <= 0:
                - if title and body parameters have been passed, use the passed parameter values as the initial
                  title and body values and return with status code 200 (OK)
                - otherwise, set missing title and/or body to empty string and return with status code 200 (OK) */
        String username = request.getParameter("username");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        String postid = request.getParameter("postid");
		String action = request.getParameter("action");

        if (username == null ) {
            request.setAttribute("error", "Action " + action + " require parameters: username ");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
		
        if ( postid == null) {
            request.setAttribute("error", "Action " + action + " require parameters:  postid");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
        int postidInt = Integer.valueOf(postid);
        if (postidInt <= 0) {
            //Set null title and body to empty 
            if (title == null){
                request.setAttribute("title","");
            }
            
            if (body == null){
                request.setAttribute("body", "");
            }
            // Return with status code 200
            request.setAttribute("title", title);
            request.setAttribute("body", body);
            request.setAttribute("username",username);
            request.setAttribute("postid", postidInt);
        }
          /*
                    If postid > 0,
                    if title and body parameters have been passed, use the passed parameter values
                    as the initial title and body values and return with status code 200 (OK)
                    */
        else if (postidInt > 0 )
        {
            //otherwise
            if (title == null || body == null)
            {
                //Check if username and postid in the database
                try{
                    //Prevent sql injection
                    selectState.setString(1, username);
                    selectState.setInt(2, postidInt);
                    ResultSet rs = selectState.executeQuery();
                    // if (username, postid) row does exist in the database
                    if (rs.next()){
                        // retrieve the title and body from the database
                        // Return with status code 200(OK)
                        title = rs.getString("title");
                        body = rs.getString("body");
                    }
                    //if does not exist, return with status code 404 (Not Found)
                    else {
                        response.sendError(HttpServletResponse.SC_NOT_FOUND);
                        return;
						
                    }
                }
                catch(SQLException ex){
                    System.out.println("SQLException caught");
                    System.out.println("---");
                    while ( ex != null ) {
                        System.out.println("Message: " + ex.getMessage());
                        System.out.println("SQLState: " + ex.getSQLState());
                        System.out.println("ErrorCode: " + ex.getErrorCode());
                        System.out.println("---");
                        ex = ex.getNextException();
                    }
                }

            }
            request.setAttribute("title", title);
            request.setAttribute("body", body);
            request.setAttribute("username",username);
            request.setAttribute("postid", postidInt);
            // Return with status code 200(OK)?

        }
        //Return "edit" page
        request.getRequestDispatcher("/edit.jsp").forward(request, response);
    }
	

    public void save(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        //required parameters: username, postid, title, and body
        //function: save the post into the database and go to the "list page" for the user
        String action = null, username = null, postid = null, title = null, body = null;
        action = request.getParameter("action");
        username = request.getParameter("username");
        postid = request.getParameter("postid");
        title = request.getParameter("title");
        body = request.getParameter("body");
        int postidInt = 0;
        ResultSet rs = null;

        if (username == null || postid == null || title == null || body == null) {
            request.setAttribute("error", "Action " + action + " require parameters: username and postid");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }else {
            postidInt = Integer.parseInt(postid);
            try {
                if (postidInt <= 0) {

                    String postidNext = getPostidNext(request, response);
                    request.setAttribute("postid", postidNext);

                    insertState.setString(1, request.getParameter("username"));
                    insertState.setString(2, postidNext);
                    insertState.setString(3, request.getParameter("title"));
                    insertState.setString(4, request.getParameter("body"));
                    insertState.setTimestamp(5, getTimestamp());
                    insertState.setTimestamp(6, getTimestamp());
                    insertState.executeUpdate();

                } else {
                    selectState.setString(1, request.getParameter("username"));
                    selectState.setString(2, request.getParameter("postid"));
                    ResultSet result = selectState.executeQuery();
                    if (result.next()) {
                        updateState.setString(1, request.getParameter("title"));
                        updateState.setString(2, request.getParameter("body"));
                        updateState.setTimestamp(3, getTimestamp());
                        updateState.setString(4, request.getParameter("username"));
                        updateState.setString(5, request.getParameter("postid"));
                        updateState.executeUpdate();

                    }
                }

            } catch (SQLException ex) {
                request.setAttribute("msg", ex.getMessage());
                request.getRequestDispatcher("/error.jsp").forward(request, response);
            }
            // redirection to list.jsp with current username
            String newPath = request.getContextPath() + "/post?action=list&username=" + request.getParameter("username");
            response.sendRedirect(newPath);
        }
    }


    public void delete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        /* required parameters: username and postid */
            /* delete the corresponding post and go to the "list page" */
        String action = null, username = null, postid = null;
        action = request.getParameter("action");
        username = request.getParameter("username");
        postid = request.getParameter("postid");
        if (username == null) {
            throw new ServletException("username can not be empty");
        }
        if (postid == null) {
            throw new ServletException("postid can not be empty");

        }else {

            // delete record
            try {
                deleteState.setString(1, request.getParameter("username"));
                deleteState.setString(2, request.getParameter("postid"));
                deleteState.executeUpdate();
            } catch (SQLException ex) {
                request.setAttribute("msg", ex.getMessage());
                request.getRequestDispatcher("/error.jsp").forward(request, response);
            }

            // redirection to list.jsp with current username
            String newPath = request.getContextPath() + "/post?action=list&username=" + request.getParameter("username");
            response.sendRedirect(newPath);
        }
    }



    public void preview(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        /* required parameters: username, postid, title, and body */
                /* return the "preview page" with the html rendering of the given title and body */
        String action = null, username = null, postid = null, title = null, body = null;
        action = request.getParameter("action");
        username = request.getParameter("username");
        postid = request.getParameter("postid");
        title = request.getParameter("title");
        body = request.getParameter("body");

        if (username == null || postid == null || title == null || body == null) {
            request.setAttribute("error",
                    "Action " + action + " require parameters: username, postid, title, and body");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }else {
			// build parser render title body
            Parser parser = Parser.builder().build();
            HtmlRenderer htrenderer = HtmlRenderer.builder().build();
            String titleContent = htrenderer.render(parser.parse(request.getParameter("title")));
            String bodyContent = htrenderer.render(parser.parse(request.getParameter("body")));
            request.setAttribute("titleContent", titleContent);
            request.setAttribute("bodyContent", bodyContent);
            
            request.setAttribute("username", request.getParameter("username"));
            request.setAttribute("postid", request.getParameter("postid"));
            request.setAttribute("title", request.getParameter("title"));
            request.setAttribute("body", request.getParameter("body"));

            
            request.getRequestDispatcher("/preview.jsp").forward(request, response);
        }
    }



    public void list(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
         /* required parameters: username
                function: return the "list page" for the user */
        String action = null, username = null, title = null, body = null,postid = null;
        action = request.getParameter("action");
        username = request.getParameter("username");

		postid = String.valueOf(0);

		request.setAttribute("postid", postid);
        if (username == null) {
            request.setAttribute("error", "Action " + action + " require parameters: username");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }else {

            // get all the data of the current user
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy' 'HH:mm:ss");
                selectUserstate.setString(1, request.getParameter("username"));
                ResultSet result = selectUserstate.executeQuery();
                
                ArrayList <List<String>> list = new ArrayList <List<String>>();
				
                while (result.next()) {
                    
                    ArrayList <String> data = new ArrayList <String>();
                    data.add(result.getString("title"));
                    data.add(dateFormat.format(result.getTimestamp("created")));
                    data.add(dateFormat.format(result.getTimestamp("modified")));
                    data.add(result.getString("postid"));
                    list.add(data);
                }
                request.setAttribute("list", list);
                String postidNext = getPostidNext(request, response);
                request.setAttribute("postidNext", postidNext);

            } catch (SQLException ex) {
                request.setAttribute("msg", ex.getMessage());
                request.getRequestDispatcher("/error.jsp").forward(request, response);
            }
            request.getRequestDispatcher("/list.jsp").forward(request, response);
        }
    }

    private Timestamp getTimestamp() {
        Date now = new Date();
        return new Timestamp(now.getTime());
    }



    private String getPostidNext(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {

        try {
            getPostState.setString(1, request.getParameter("username"));
            ResultSet result = getPostState.executeQuery();
            if (result.next()) {
                return String.valueOf(result.getInt(1) + 1);
            } else {
                return "1";
            }
        } catch(SQLException ex) {
            request.setAttribute("msg", ex.getMessage());
            request.getRequestDispatcher("/error.jsp").forward(request, response);
        }
        return "";
    }
}