package servlet;

import java.io.IOException;
import dao.UserDAO;
import model.User;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String loginType = request.getParameter("loginType");
        
        Map<String, Object> jsonResponse = new HashMap<>();
        
        User user = userDAO.authenticateUser(username, password, loginType);
        
        if (user != null) {
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("username", user.getUsername());
            
            jsonResponse.put("success", true);
            jsonResponse.put("message", "Login successful");
            jsonResponse.put("username", user.getUsername());
            jsonResponse.put("userId", user.getUserId());
        } else {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Invalid credentials");
        }
        
        response.getWriter().write(gson.toJson(jsonResponse));
    }
}