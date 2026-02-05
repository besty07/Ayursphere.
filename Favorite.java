package model;

import java.sql.Timestamp;

public class Favorite {
    private int favoriteId;
    private int userId;
    private int plantId;
    private Timestamp addedAt;
    
    // Constructors
    public Favorite() {}
    
    public Favorite(int userId, int plantId) {
        this.userId = userId;
        this.plantId = plantId;
    }
    
    // Getters and Setters
    public int getFavoriteId() {
        return favoriteId;
    }
    
    public void setFavoriteId(int favoriteId) {
        this.favoriteId = favoriteId;
    }
    
    public int getUserId() {
        return userId;
    }
    
    public void setUserId(int userId) {
        this.userId = userId;
    }
    
    public int getPlantId() {
        return plantId;
    }
    
    public void setPlantId(int plantId) {
        this.plantId = plantId;
    }
    
    public Timestamp getAddedAt() {
        return addedAt;
    }
    
    public void setAddedAt(Timestamp addedAt) {
        this.addedAt = addedAt;
    }
    
    @Override
    public String toString() {
        return "Favorite{" +
                "favoriteId=" + favoriteId +
                ", userId=" + userId +
                ", plantId=" + plantId +
                ", addedAt=" + addedAt +
                '}';
    }
}