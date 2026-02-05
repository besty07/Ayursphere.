package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Plant;

public class FavoriteDAO {
    
    // Add favorite
    public boolean addFavorite(int userId, int plantId) {
        String query = "INSERT INTO favorites (user_id, plant_id) VALUES (?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setInt(1, userId);
            pstmt.setInt(2, plantId);
            
            int result = pstmt.executeUpdate();
            return result > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    
    // Remove favorite
    public boolean removeFavorite(int userId, int plantId) {
        String query = "DELETE FROM favorites WHERE user_id = ? AND plant_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setInt(1, userId);
            pstmt.setInt(2, plantId);
            
            int result = pstmt.executeUpdate();
            return result > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    
    // Get user's favorites
    public List<Plant> getUserFavorites(int userId) {
        List<Plant> favorites = new ArrayList<>();
        String query = "SELECT p.* FROM plants p " +
                      "INNER JOIN favorites f ON p.plant_id = f.plant_id " +
                      "WHERE f.user_id = ? ORDER BY f.added_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Plant plant = new Plant();
                plant.setPlantId(rs.getInt("plant_id"));
                plant.setPlantName(rs.getString("plant_name"));
                plant.setScientificName(rs.getString("scientific_name"));
                plant.setDescription(rs.getString("description"));
                plant.setUses(rs.getString("uses"));
                plant.setImagePath(rs.getString("image_path"));
                plant.setCategory(rs.getString("category"));
                favorites.add(plant);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return favorites;
    }
    
    // Check if plant is favorited
    public boolean isFavorite(int userId, int plantId) {
        String query = "SELECT COUNT(*) FROM favorites WHERE user_id = ? AND plant_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setInt(1, userId);
            pstmt.setInt(2, plantId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}