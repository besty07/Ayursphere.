package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import jakarta.servlet.annotation.WebServlet;


@WebServlet("/DatabaseConnection")
public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/AyurFinal";
    private static final String USER = "root"; // Change as per your MySQL setup
    private static final String PASSWORD = "2007"; // Change as per your MySQL setup
    
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
    
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}