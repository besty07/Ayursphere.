package servlet;

import java.io.IOException;
import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import dao.PlantDAO;
import dao.UserDAO;
import model.Plant;
import model.User;

import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/signup")
public class SignupServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        Map<String, Object> jsonResponse = new HashMap<>();
        
        if (userDAO.registerUser(username, password)) {
            User user = userDAO.getUserByUsername(username);
            
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("username", user.getUsername());
            
            jsonResponse.put("success", true);
            jsonResponse.put("message", "Registration successful");
            jsonResponse.put("username", username);
            jsonResponse.put("userId", user.getUserId());
        } else {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Username already exists");
        }
        
        response.getWriter().write(gson.toJson(jsonResponse));
    }
}