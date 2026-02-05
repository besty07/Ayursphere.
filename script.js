// Note: Create this as a new file and replace script.js later

// Get DOM elements
const loginTypeSelector = document.getElementById('loginTypeSelector');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const backBtn = document.getElementById('backBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const formTitle = document.getElementById('formTitle');
const loginTypeBadge = document.getElementById('loginTypeBadge');
const badgeText = document.getElementById('badgeText');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');
const togglePasswordBtn = document.getElementById('togglePassword');
const showSignupLink = document.getElementById('showSignupLink');
const showLoginLink = document.getElementById('showLoginLink');

// Signup form elements
const signupUsernameInput = document.getElementById('signupUsername');
const signupPasswordInput = document.getElementById('signupPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const signupMessageDiv = document.getElementById('signupMessage');
const toggleSignupPasswordBtn = document.getElementById('toggleSignupPassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

let currentLoginType = '';

// Add particle effect
createParticles();

// Login type button handlers
document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        showLoginForm(type);
    });
});

// Back button handler
backBtn.addEventListener('click', function() {
    showLoginTypeSelector();
});

// Back to login from signup
backToLoginBtn.addEventListener('click', function() {
    signupForm.style.display = 'none';
    loginTypeSelector.style.display = 'block';
    signupForm.reset();
    signupMessageDiv.textContent = '';
    signupMessageDiv.className = 'message';
});

// Show signup form
showSignupLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    loginForm.reset();
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    setTimeout(() => {
        signupUsernameInput.focus();
    }, 100);
});

// Show login form from signup
showLoginLink.addEventListener('click', function(e) {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    signupForm.reset();
    signupMessageDiv.textContent = '';
    signupMessageDiv.className = 'message';
    setTimeout(() => {
        usernameInput.focus();
    }, 100);
});

// Toggle password visibility handlers (same as before)
togglePasswordBtn.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type');
    if (type === 'password') {
        passwordInput.setAttribute('type', 'text');
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.setAttribute('type', 'password');
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

toggleSignupPasswordBtn.addEventListener('click', function() {
    const type = signupPasswordInput.getAttribute('type');
    if (type === 'password') {
        signupPasswordInput.setAttribute('type', 'text');
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        signupPasswordInput.setAttribute('type', 'password');
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

toggleConfirmPasswordBtn.addEventListener('click', function() {
    const type = confirmPasswordInput.getAttribute('type');
    if (type === 'password') {
        confirmPasswordInput.setAttribute('type', 'text');
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        confirmPasswordInput.setAttribute('type', 'password');
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// Form submission handler - BACKEND VERSION
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    // Validate inputs
    if (!username || !password) {
        showMessage('Please enter both username and password', 'error');
        return;
    }
    
    // Add loading animation to button
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    try {
        // Send login request to backend
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('loginType', currentLoginType);
        
        const response = await fetch('/AyurFinalproj/LoginServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Successful login
            showMessage(`Welcome to AyurSphere, ${username}! 🌿`, 'success');
            
            // Store username in localStorage
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userId', data.userId);
            
            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = `dashboard.html?user=${encodeURIComponent(username)}`;
            }, 1500);
        } else {
            // Failed login
            showMessage(data.message || 'Invalid credentials!', 'error');
            passwordInput.value = '';
            passwordInput.focus();
            
            // Add shake animation
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
            
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Connection error. Please try again.', 'error');
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
});

// Signup form submission handler - BACKEND VERSION
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    // Clear previous messages
    signupMessageDiv.textContent = '';
    signupMessageDiv.className = 'message';
    
    // Validate inputs (same as before)
    if (!username || !password || !confirmPassword) {
        showSignupMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (username.length < 3) {
        showSignupMessage('Username must be at least 3 characters long', 'error');
        return;
    }
    
    if (password.length < 6) {
        showSignupMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showSignupMessage('Passwords do not match!', 'error');
        confirmPasswordInput.value = '';
        confirmPasswordInput.focus();
        signupForm.classList.add('shake');
        setTimeout(() => {
            signupForm.classList.remove('shake');
        }, 500);
        return;
    }
    
    // Add loading animation to button
    const signupBtn = signupForm.querySelector('.login-btn');
    signupBtn.classList.add('loading');
    signupBtn.disabled = true;
    
    try {
        // Send signup request to backend
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch('/AyurFinalproj/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show success message
            showSignupMessage(`Account created successfully! Welcome, ${username}! 🌿`, 'success');
            
            // Store username in localStorage
            localStorage.setItem('currentUser', username);
            localStorage.setItem('userId', data.userId);
            
            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = `dashboard.html?user=${encodeURIComponent(username)}`;
            }, 1500);
        } else {
            // Failed signup
            showSignupMessage(data.message || 'Registration failed!', 'error');
            signupUsernameInput.focus();
            signupForm.classList.add('shake');
            setTimeout(() => {
                signupForm.classList.remove('shake');
            }, 500);
            
            signupBtn.classList.remove('loading');
            signupBtn.disabled = false;
        }
    } catch (error) {
        console.error('Signup error:', error);
        showSignupMessage('Connection error. Please try again.', 'error');
        signupBtn.classList.remove('loading');
        signupBtn.disabled = false;
    }
});

// Other functions remain same
function showLoginForm(type) {
    currentLoginType = type;
    loginTypeSelector.style.display = 'none';
    loginForm.style.display = 'block';
    
    const createAccountLink = document.getElementById('createAccountLink');
    
    if (type === 'admin') {
        formTitle.textContent = 'Administrator Login';
        badgeText.textContent = 'Admin Access';
        loginTypeBadge.innerHTML = '<i class="fas fa-user-shield"></i><span id="badgeText">Admin Access</span>';
        loginTypeBadge.style.background = 'linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(210, 105, 30, 0.1))';
        loginTypeBadge.style.borderColor = 'rgba(139, 69, 19, 0.3)';
        loginTypeBadge.style.color = '#8b4513';
        createAccountLink.style.display = 'none';
    } else {
        formTitle.textContent = 'User Portal Login';
        badgeText.textContent = 'User Access';
        loginTypeBadge.innerHTML = '<i class="fas fa-user-circle"></i><span id="badgeText">User Access</span>';
        loginTypeBadge.style.background = 'linear-gradient(135deg, rgba(107, 158, 62, 0.1), rgba(45, 80, 22, 0.1))';
        loginTypeBadge.style.borderColor = 'rgba(107, 158, 62, 0.3)';
        loginTypeBadge.style.color = '#2d5016';
        createAccountLink.style.display = 'block';
    }
    
    setTimeout(() => {
        usernameInput.focus();
    }, 100);
}

function showLoginTypeSelector() {
    loginForm.style.display = 'none';
    loginTypeSelector.style.display = 'block';
    loginForm.reset();
    messageDiv.textContent = '';
    messageDiv.className = 'message';
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

function showSignupMessage(text, type) {
    signupMessageDiv.textContent = text;
    signupMessageDiv.className = `message ${type}`;
}

// Clear messages when typing (same as before)
usernameInput.addEventListener('input', function() {
    if (messageDiv.classList.contains('error')) {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }
});

passwordInput.addEventListener('input', function() {
    if (messageDiv.classList.contains('error')) {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }
});

signupUsernameInput.addEventListener('input', function() {
    if (signupMessageDiv.classList.contains('error')) {
        signupMessageDiv.textContent = '';
        signupMessageDiv.className = 'message';
    }
});

signupPasswordInput.addEventListener('input', function() {
    if (signupMessageDiv.classList.contains('error')) {
        signupMessageDiv.textContent = '';
        signupMessageDiv.className = 'message';
    }
});

confirmPasswordInput.addEventListener('input', function() {
    if (signupMessageDiv.classList.contains('error')) {
        signupMessageDiv.textContent = '';
        signupMessageDiv.className = 'message';
    }
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(107, 158, 62, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('%c🌿 AyurSphere - The sphere of healing, reimagined 🌿', 'color: #2d5016; font-size: 16px; font-weight: bold;');
console.log('%cBackend-connected version loaded!', 'color: #6b9e3e; font-size: 14px;');