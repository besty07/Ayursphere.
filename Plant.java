// filepath: src/com/ayursphere/model/Plant.java
package model;

public class Plant {
    private int plantId;
    private String plantName;
    private String scientificName;
    private String description;
    private String uses;
    private String imagePath;
    private String category;
    
    // Constructors
    public Plant() {}
    
    // Getters and Setters
    public int getPlantId() { return plantId; }
    public void setPlantId(int plantId) { this.plantId = plantId; }
    
    public String getPlantName() { return plantName; }
    public void setPlantName(String plantName) { this.plantName = plantName; }
    
    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getUses() { return uses; }
    public void setUses(String uses) { this.uses = uses; }
    
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}