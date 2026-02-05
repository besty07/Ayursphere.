// Note: Create this as a new file and replace dashboard.js later

// Get username from localStorage or URL parameter
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user') || localStorage.getItem('currentUser') || 'Demo User';
const userId = localStorage.getItem('userId');

// Update greeting with username
document.getElementById('userGreeting').textContent = username;

// Update username in header
const usernameElement = document.getElementById('usernameDisplay');
if (usernameElement) {
    usernameElement.textContent = username;
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
});

// Load plants from backend
async function loadPlants() {
    try {
        console.log('🌿 Fetching plants from database...');
        const response = await fetch('/AyurFinalproj/api/plants');
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response OK:', response.ok);
        
        const plants = await response.json();
        
        console.log('✅ Successfully loaded plants from DATABASE');
        console.log('📊 Total plants loaded:', plants.length);
        console.log('🔍 First plant:', plants[0]);
        console.log('📋 All plants:', plants);
        
        // Clear existing plant cards
        const plantGrid = document.querySelector('.plants-grid');
        if (!plantGrid) {
            console.error('❌ Plant grid container not found');
            return;
        }
        plantGrid.innerHTML = '';
        
        // Get user's favorites
        const favorites = await getUserFavorites();
        const favoriteIds = favorites.map(f => f.plantId);
        
        // Create plant cards
        plants.forEach(plant => {
            const isFavorite = favoriteIds.includes(plant.plantId);
            const plantCard = createPlantCard(plant, isFavorite);
            plantGrid.appendChild(plantCard);
        });
        
        console.log('✅ Rendered', plants.length, 'plant cards to the page');
        
        // Initialize favorite buttons
        initializeFavoriteButtons();
        
    } catch (error) {
        console.error('❌ Error loading plants from database:', error);
    }
}

// Create plant card element
function createPlantCard(plant, isFavorite) {
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.setAttribute('data-plant-id', plant.plantId);
    
    // Extract category badge class from category
    const categoryClass = (plant.category || 'herb').toLowerCase().replace(/\s+/g, '-');
    
    card.innerHTML = `
        <div class="plant-image">
            <img src="${plant.imagePath || 'images/default-plant.jpg'}" alt="${plant.plantName}" onerror="this.src='images/default-plant.jpg'">
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-plant-id="${plant.plantId}">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
            </button>
            <span class="plant-badge ${categoryClass}">${plant.category || 'Herb'}</span>
        </div>
        <div class="plant-info">
            <h3>${plant.plantName}</h3>
            <p class="scientific-name">${plant.scientificName}</p>
            <p class="plant-description">${plant.description || ''}</p>
            <div class="plant-uses">
                <strong>Uses:</strong> ${plant.uses || 'Not specified'}
            </div>
        </div>
    `;
    
    return card;
}

// Get user's favorites
async function getUserFavorites() {
    if (!userId) {
        console.log('No user ID found, skipping favorites load');
        return [];
    }
    
    try {
        const response = await fetch('/AyurFinalproj/api/favorites');
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
}

// Initialize favorite buttons
function initializeFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.stopPropagation();
            const plantId = this.getAttribute('data-plant-id');
            const isActive = this.classList.contains('active');
            
            try {
                if (isActive) {
                    // Remove from favorites
                    const response = await fetch(`/AyurFinalproj/api/favorites?plantId=${plantId}`, {
                        method: 'DELETE'
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        this.classList.remove('active');
                        const icon = this.querySelector('i');
                        icon.className = 'far fa-heart';
                    }
                } else {
                    // Add to favorites
                    const formData = new URLSearchParams();
                    formData.append('plantId', plantId);
                    
                    const response = await fetch('/AyurFinalproj/api/favorites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        this.classList.add('active');
                        const icon = this.querySelector('i');
                        icon.className = 'fas fa-heart';
                    }
                }
                
                // Update favorites count
                updateFavoritesCount();
                
            } catch (error) {
                console.error('Error updating favorite:', error);
            }
        });
    });
}

// Update favorites count
async function updateFavoritesCount() {
    try {
        const favorites = await getUserFavorites();
        const countElement = document.querySelector('.favorites-count');
        if (countElement) {
            countElement.textContent = favorites.length;
        }
    } catch (error) {
        console.error('Error updating favorites count:', error);
    }
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
console.log('🔍 Search input found:', searchInput);

if (searchInput) {
    searchInput.addEventListener('input', async function(e) {
        const searchTerm = e.target.value.trim();
        console.log('🔍 Searching for:', searchTerm);
        
        try {
            const url = searchTerm 
                ? `/AyurFinalproj/api/plants?search=${encodeURIComponent(searchTerm)}`
                : '/AyurFinalproj/api/plants';
            
            console.log('🔍 Fetching URL:', url);
            const response = await fetch(url);
            console.log('🔍 Response status:', response.status);
            
            const plants = await response.json();
            console.log('🔍 Plants returned:', plants.length);
            
            // Get user's favorites
            const favorites = await getUserFavorites();
            const favoriteIds = favorites.map(f => f.plantId);
            
            // Update plant grid
            const plantGrid = document.querySelector('.plants-grid');
            console.log('🔍 Plant grid found:', plantGrid);
            
            if (!plantGrid) {
                console.error('Plants grid container not found!');
                return;
            }
            plantGrid.innerHTML = '';
            
            plants.forEach(plant => {
                const isFavorite = favoriteIds.includes(plant.plantId);
                const plantCard = createPlantCard(plant, isFavorite);
                plantGrid.appendChild(plantCard);
            });
            
            console.log('🔍 Rendered', plants.length, 'cards');
            
            // Reinitialize favorite buttons
            initializeFavoriteButtons();
            
        } catch (error) {
            console.error('Error searching plants:', error);
        }
    });
} else {
    console.error('❌ Search input not found!');
}

// Load plants on page load
loadPlants();
updateFavoritesCount();

// Category Filter Functionality
let currentCategory = 'all';

function initializeCategoryFilters() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', async function() {
            // Update active state
            categoryItems.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            // Get selected category
            currentCategory = this.getAttribute('data-category');
            console.log('📂 Category selected:', currentCategory);
            
            // Clear search input
            const searchInput = document.querySelector('.search-bar input');
            if (searchInput) searchInput.value = '';
            
            // Load filtered plants
            await loadPlantsByCategory(currentCategory);
        });
    });
}

async function loadPlantsByCategory(category) {
    try {
        let url = '/AyurFinalproj/api/plants';
        if (category && category !== 'all') {
            url += `?category=${encodeURIComponent(category)}`;
        }
        
        console.log('📂 Fetching URL:', url);
        const response = await fetch(url);
        const plants = await response.json();
        
        console.log('📂 Plants in category:', plants.length);
        
        // Get user's favorites
        const favorites = await getUserFavorites();
        const favoriteIds = favorites.map(f => f.plantId);
        
        // Update plant grid
        const plantGrid = document.querySelector('.plants-grid');
        if (!plantGrid) {
            console.error('Plants grid container not found!');
            return;
        }
        plantGrid.innerHTML = '';
        
        if (plants.length === 0) {
            plantGrid.innerHTML = `
                <div class="no-plants-message">
                    <i class="fas fa-seedling"></i>
                    <p>No plants found in this category</p>
                </div>
            `;
            return;
        }
        
        plants.forEach(plant => {
            const isFavorite = favoriteIds.includes(plant.plantId);
            const plantCard = createPlantCard(plant, isFavorite);
            plantGrid.appendChild(plantCard);
        });
        
        // Reinitialize favorite buttons
        initializeFavoriteButtons();
        
    } catch (error) {
        console.error('Error loading plants by category:', error);
    }
}

// Initialize category filters
initializeCategoryFilters();

// Add Plant Modal Functionality
const addPlantBtn = document.querySelector('.add-plant-btn');
const modal = document.getElementById('addPlantModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const addPlantForm = document.getElementById('addPlantForm');

// Open modal
if (addPlantBtn) {
    addPlantBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    });
}

// Close modal functions
function closeAddPlantModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    addPlantForm.reset(); // Clear form
}

if (closeModal) {
    closeModal.addEventListener('click', closeAddPlantModal);
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', closeAddPlantModal);
}

// Close on clicking outside modal
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeAddPlantModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeAddPlantModal();
    }
});

// Handle form submission
if (addPlantForm) {
    addPlantForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const plantData = {
            plantName: document.getElementById('plantName').value,
            scientificName: document.getElementById('scientificName').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            uses: document.getElementById('uses').value,
            imagePath: document.getElementById('imagePath').value || 'images/default-plant.jpg'
        };
        
        console.log('New plant data:', plantData);
        
        // Show success message
        alert(`Plant "${plantData.plantName}" details captured successfully!\n\nNote: This is a demo - data is not saved to database.`);
        
        // Close modal
        closeAddPlantModal();
    });
}

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