package dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Plant;

public class PlantDAO {
    
    // Get all plants
    public List<Plant> getAllPlants() {
        List<Plant> plants = new ArrayList<>();
        String query = "SELECT * FROM plants ORDER BY plant_id";
        
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            while (rs.next()) {
                Plant plant = new Plant();
                plant.setPlantId(rs.getInt("plant_id"));
                plant.setPlantName(rs.getString("plant_name"));
                plant.setScientificName(rs.getString("scientific_name"));
                plant.setDescription(rs.getString("description"));
                plant.setUses(rs.getString("uses"));
                plant.setImagePath(rs.getString("image_path"));
                plant.setCategory(rs.getString("category"));
                plants.add(plant);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return plants;
    }
    
    // Get plant by ID
    public Plant getPlantById(int plantId) {
        String query = "SELECT * FROM plants WHERE plant_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setInt(1, plantId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                Plant plant = new Plant();
                plant.setPlantId(rs.getInt("plant_id"));
                plant.setPlantName(rs.getString("plant_name"));
                plant.setScientificName(rs.getString("scientific_name"));
                plant.setDescription(rs.getString("description"));
                plant.setUses(rs.getString("uses"));
                plant.setImagePath(rs.getString("image_path"));
                plant.setCategory(rs.getString("category"));
                return plant;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    // Search plants
    public List<Plant> searchPlants(String searchTerm) {
        List<Plant> plants = new ArrayList<>();
        String query = "SELECT * FROM plants WHERE plant_name LIKE ? OR scientific_name LIKE ? OR description LIKE ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            String searchPattern = "%" + searchTerm + "%";
            pstmt.setString(1, searchPattern);
            pstmt.setString(2, searchPattern);
            pstmt.setString(3, searchPattern);
            
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
                plants.add(plant);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return plants;
    }
    
    // Get plants by category
    public List<Plant> getPlantsByCategory(String category) {
        List<Plant> plants = new ArrayList<>();
        String query = "SELECT * FROM plants WHERE category = ? ORDER BY plant_id";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, category);
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
                plants.add(plant);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return plants;
    }
}