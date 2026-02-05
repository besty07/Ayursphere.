package servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.*;
import java.sql.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import dao.FavoriteDAO;
import model.Plant;
import com.google.gson.Gson;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/favorites")
public class FavoriteServlet extends HttpServlet {
    private FavoriteDAO favoriteDAO = new FavoriteDAO();
    private Gson gson = new Gson();
    
    // Get favorites
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
        int userId = (int) session.getAttribute("userId");
        List<Plant> favorites = favoriteDAO.getUserFavorites(userId);
        
        response.getWriter().write(gson.toJson(favorites));
    }
    
    // Add favorite
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        Map<String, Object> jsonResponse = new HashMap<>();
        
        if (session == null || session.getAttribute("userId") == null) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "User not logged in");
            response.getWriter().write(gson.toJson(jsonResponse));
            return;
        }
        
        int userId = (int) session.getAttribute("userId");
        int plantId = Integer.parseInt(request.getParameter("plantId"));
        
        boolean success = favoriteDAO.addFavorite(userId, plantId);
        jsonResponse.put("success", success);
        jsonResponse.put("message", success ? "Added to favorites" : "Failed to add favorite");
        
        response.getWriter().write(gson.toJson(jsonResponse));
    }
    
    // Remove favorite
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        Map<String, Object> jsonResponse = new HashMap<>();
        
        if (session == null || session.getAttribute("userId") == null) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "User not logged in");
            response.getWriter().write(gson.toJson(jsonResponse));
            return;
        }
        
        int userId = (int) session.getAttribute("userId");
        int plantId = Integer.parseInt(request.getParameter("plantId"));
        
        boolean success = favoriteDAO.removeFavorite(userId, plantId);
        jsonResponse.put("success", success);
        jsonResponse.put("message", success ? "Removed from favorites" : "Failed to remove favorite");
        
        response.getWriter().write(gson.toJson(jsonResponse));
    }
}