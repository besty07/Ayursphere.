// Note: Create this as a new file and replace favorites.js later

const favoritesGrid = document.getElementById('favoritesGrid');
const emptyFavorites = document.getElementById('emptyFavorites');
const username = localStorage.getItem('currentUser') || 'Demo User';
const userId = localStorage.getItem('userId');

// Update username in header
document.querySelector('.username').textContent = `${username}`;

// Load favorites from backend
async function loadFavorites(sortBy = 'recent') {
    try {
    const response = await fetch('/AyurFinalproj/api/favorites');
        
        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }
        
        let favorites = await response.json();
        
        // Sort favorites
        if (sortBy === 'alphabetical') {
            favorites.sort((a, b) => a.plantName.localeCompare(b.plantName));
        }
        // 'recent' is default from backend (ORDER BY added_at DESC)
        
        updateFavoritesDisplay(favorites);
        
    } catch (error) {
        console.error('Error loading favorites:', error);
        emptyFavorites.style.display = 'block';
        favoritesGrid.style.display = 'none';
    }
}

// Update favorites display
function updateFavoritesDisplay(favorites) {
    if (favorites.length === 0) {
        emptyFavorites.style.display = 'block';
        favoritesGrid.style.display = 'none';
    } else {
        emptyFavorites.style.display = 'none';
        favoritesGrid.style.display = 'grid';
        
        favoritesGrid.innerHTML = '';
        favorites.forEach(plant => {
            const plantCard = createPlantCard(plant);
            favoritesGrid.appendChild(plantCard);
        });
    }
}

// Create plant card
function createPlantCard(plant) {
    const card = document.createElement('div');
    card.className = 'plant-card';
    
    card.innerHTML = `
        <div class="plant-image">
            <img src="${plant.imagePath}" alt="${plant.plantName}">
            <button class="remove-favorite-btn" data-plant-id="${plant.plantId}">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="plant-info">
            <h3 class="plant-name">${plant.plantName}</h3>
            <p class="plant-scientific">${plant.scientificName}</p>
            <p class="plant-description">${plant.description}</p>
            <div class="plant-uses">
                <i class="fas fa-leaf"></i>
                <span>${plant.uses}</span>
            </div>
        </div>
    `;
    
    // Add remove functionality
    const removeBtn = card.querySelector('.remove-favorite-btn');
    removeBtn.addEventListener('click', () => removeFavorite(plant.plantId));
    
    return card;
}

// Remove favorite
async function removeFavorite(plantId) {
    try {
    const response = await fetch(`/AyurFinalproj/api/favorites?plantId=${plantId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadFavorites(); // Reload favorites
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
});

// Search functionality
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', async function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        try {
            const response = await fetch('/AyurFinalproj/api/favorites');
            let favorites = await response.json();
            
            if (searchTerm) {
                favorites = favorites.filter(plant => 
                    plant.plantName.toLowerCase().includes(searchTerm) ||
                    plant.scientificName.toLowerCase().includes(searchTerm) ||
                    plant.description.toLowerCase().includes(searchTerm)
                );
            }
            
            updateFavoritesDisplay(favorites);
        } catch (error) {
            console.error('Error searching favorites:', error);
        }
    });
}

// Sort functionality
const sortButtons = document.querySelectorAll('.sort-menu button');
sortButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const sortBy = this.getAttribute('data-sort');
        loadFavorites(sortBy);
    });
});

// Load favorites on page load
loadFavorites();

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);