package servlet;

import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import dao.PlantDAO;
import model.Plant;


@WebServlet("/api/plants")
public class PlantServlet extends HttpServlet {
    private PlantDAO plantDAO = new PlantDAO();
    private Gson gson = new Gson();
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String searchTerm = request.getParameter("search");
        String category = request.getParameter("category");
        List<Plant> plants;
        
        if (searchTerm != null && !searchTerm.isEmpty()) {
            plants = plantDAO.searchPlants(searchTerm);
        } else if (category != null && !category.isEmpty()) {
            plants = plantDAO.getPlantsByCategory(category);
        } else {
            plants = plantDAO.getAllPlants();
        }
        
        response.getWriter().write(gson.toJson(plants));
    }
}