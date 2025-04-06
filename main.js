// Initialize localStorage with default data if empty
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}
if (!localStorage.getItem('admin')) {
    localStorage.setItem('admin', JSON.stringify({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
    }));
}
if (!localStorage.getItem('favorites')) {
    localStorage.setItem('favorites', JSON.stringify({}));
}
if (!localStorage.getItem('comments')) {
    localStorage.setItem('comments', JSON.stringify({}));
}

// DOM Elements
const userAccountBtn = document.getElementById('userAccountBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const userAccountModal = document.getElementById('userAccountModal');
const adminPanelModal = document.getElementById('adminPanelModal');
const commentModal = document.getElementById('commentModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userProfile = document.getElementById('userProfile');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const closeUserModal = document.getElementById('closeUserModal');
const closeAdminModal = document.getElementById('closeAdminModal');
const closeCommentModal = document.getElementById('closeCommentModal');
const sortBySelect = document.getElementById('sortBy');
const searchCarsInput = document.getElementById('searchCars');
const searchUsersInput = document.getElementById('searchUsers');
const favoritesGrid = document.getElementById('favoritesGrid');
const commentForm = document.getElementById('commentForm');
const commentsContainer = document.getElementById('commentsContainer');
const contactForm = document.getElementById('contactForm');
const ctaButton = document.querySelector('.cta-button');

// Car Data
const cars = [
    { id: 1, name: 'Tesla Model 3', type: 'Electric Sedan', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'BMW M4', type: 'Sports Coupe', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Mercedes S-Class', type: 'Luxury Sedan', image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Audi RS6', type: 'Performance Wagon', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Porsche 911', type: 'Sports Car', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Ferrari F8', type: 'Supercar', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80' }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCarDisplay();
    updateFavoritesDisplay();
    checkLoginStatus();
    
    // Add animation for sections when they come into view
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

userAccountBtn.addEventListener('click', () => {
    userAccountModal.style.display = 'block';
    setTimeout(() => {
        userAccountModal.classList.add('show');
    }, 10);
});

adminPanelBtn.addEventListener('click', () => {
    adminPanelModal.style.display = 'block';
    setTimeout(() => {
        adminPanelModal.classList.add('show');
    }, 10);
    updateUsersList();
});

closeUserModal.addEventListener('click', () => {
    userAccountModal.classList.remove('show');
    setTimeout(() => {
        userAccountModal.style.display = 'none';
    }, 300);
});

closeAdminModal.addEventListener('click', () => {
    adminPanelModal.classList.remove('show');
    setTimeout(() => {
        adminPanelModal.style.display = 'none';
    }, 300);
});

closeCommentModal.addEventListener('click', () => {
    commentModal.classList.remove('show');
    setTimeout(() => {
        commentModal.style.display = 'none';
    }, 300);
});

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    checkLoginStatus();
    userAccountModal.classList.remove('show');
    setTimeout(() => {
        userAccountModal.style.display = 'none';
    }, 300);
});

sortBySelect.addEventListener('change', updateCarDisplay);
searchCarsInput.addEventListener('input', updateCarDisplay);
searchUsersInput.addEventListener('input', updateUsersList);

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === userAccountModal) {
        userAccountModal.classList.remove('show');
        setTimeout(() => {
            userAccountModal.style.display = 'none';
        }, 300);
    }
    if (e.target === adminPanelModal) {
        adminPanelModal.classList.remove('show');
        setTimeout(() => {
            adminPanelModal.style.display = 'none';
        }, 300);
    }
});

// User Registration
document.getElementById('userRegisterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const users = JSON.parse(localStorage.getItem('users'));
    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }

    users.push({ 
        username, 
        email, 
        password, 
        status: 'active',
        role: 'user'
    });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Initialize favorites for the new user
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    favorites[username] = [];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    localStorage.setItem('currentUser', JSON.stringify({ username, email, role: 'user' }));
    
    alert('Registration successful!');
    checkLoginStatus();
    userAccountModal.classList.remove('show');
    setTimeout(() => {
        userAccountModal.style.display = 'none';
    }, 300);
});

// User Login
document.getElementById('userLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Check if it's an admin login attempt
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (username === admin.username && password === admin.password) {
        localStorage.setItem('currentUser', JSON.stringify({ 
            username, 
            role: 'admin' 
        }));
        alert('Admin login successful!');
        checkLoginStatus();
        userAccountModal.classList.remove('show');
        setTimeout(() => {
            userAccountModal.style.display = 'none';
        }, 300);
        return;
    }

    // Regular user login
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        if (user.status === 'banned') {
            alert('Your account has been banned. Please contact support.');
            return;
        }
        
        // Ensure favorites exist for this user
        const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        if (!favorites[username]) {
            favorites[username] = [];
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        
        localStorage.setItem('currentUser', JSON.stringify({ 
            username, 
            email: user.email, 
            role: user.role 
        }));
        alert('Login successful!');
        checkLoginStatus();
        userAccountModal.classList.remove('show');
        setTimeout(() => {
            userAccountModal.style.display = 'none';
        }, 300);
    } else {
        alert('Invalid username or password!');
    }
});

// Functions
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const favoritesLink = document.querySelector('a[href="#favorites"]');
    
    if (currentUser) {
        userAccountBtn.textContent = currentUser.username;
        if (currentUser.role === 'admin') {
            adminPanelBtn.style.display = 'block';
            favoritesLink.style.display = 'none';
            
            // Show admin profile
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            userProfile.style.display = 'block';
            document.getElementById('profileUsername').textContent = currentUser.username;
            document.getElementById('profileEmail').textContent = 'Admin Account';
        } else {
            adminPanelBtn.style.display = 'none';
            favoritesLink.style.display = 'block';
            
            // Show user profile
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            userProfile.style.display = 'block';
            document.getElementById('profileUsername').textContent = currentUser.username;
            document.getElementById('profileEmail').textContent = currentUser.email;
        }
    } else {
        userAccountBtn.textContent = 'My Account';
        adminPanelBtn.style.display = 'none';
        favoritesLink.style.display = 'none';
        
        // Show login form
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        userProfile.style.display = 'none';
    }
    
    // Update car display to show correct favorite status
    updateCarDisplay();
    // Update favorites display
    updateFavoritesDisplay();
}

function updateCarDisplay() {
    const carsGrid = document.querySelector('.cars-grid');
    const sortBy = sortBySelect.value;
    const searchTerm = searchCarsInput.value.toLowerCase();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const favorites = currentUser && currentUser.role === 'user' ? 
        JSON.parse(localStorage.getItem('favorites'))[currentUser.username] || [] : [];

    let filteredCars = cars.filter(car => 
        car.name.toLowerCase().includes(searchTerm) || 
        car.type.toLowerCase().includes(searchTerm)
    );

    filteredCars.sort((a, b) => {
        const [field, direction] = sortBy.split('-');
        const multiplier = direction === 'asc' ? 1 : -1;
        return multiplier * a[field].localeCompare(b[field]);
    });

    carsGrid.innerHTML = filteredCars.map(car => {
        const isFavorite = favorites.includes(car.id);
        return `
            <div class="car-card" data-car-id="${car.id}">
                <img src="${car.image}" alt="${car.name}">
                <h3>${car.name}</h3>
                <p>${car.type}</p>
                <div class="buttons">
                    <button class="favorite-btn ${isFavorite ? 'added' : ''}" onclick="toggleFavorite(${car.id})">
                        <i class="fas fa-heart"></i> ${isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
                    </button>
                    <button class="comment-btn">Add Comment</button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleFavorite(carId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'user') {
        alert('Please login as a regular user to add favorites!');
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    if (!favorites[currentUser.username]) {
        favorites[currentUser.username] = [];
    }

    const index = favorites[currentUser.username].indexOf(carId);
    if (index === -1) {
        favorites[currentUser.username].push(carId);
        // Show success message
        const favoriteBtn = document.querySelector(`.car-card[data-car-id="${carId}"] .favorite-btn`);
        if (favoriteBtn) {
            favoriteBtn.classList.add('added');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Favorites';
        }
    } else {
        favorites[currentUser.username].splice(index, 1);
        // Update button text
        const favoriteBtn = document.querySelector(`.car-card[data-car-id="${carId}"] .favorite-btn`);
        if (favoriteBtn) {
            favoriteBtn.classList.remove('added');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
        }
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateCarDisplay();
    updateFavoritesDisplay();
}

function updateFavoritesDisplay() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'user') {
        favoritesGrid.innerHTML = '<p class="no-favorites">Please login as a regular user to view your favorites</p>';
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    const userFavorites = favorites[currentUser.username] || [];
    
    if (userFavorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="no-favorites">No favorite cars yet</p>';
        return;
    }

    favoritesGrid.innerHTML = userFavorites.map(carId => {
        const car = cars.find(c => c.id === carId);
        return `
            <div class="car-card">
                <img src="${car.image}" alt="${car.name}">
                <h3>${car.name}</h3>
                <p>${car.type}</p>
                <div class="buttons">
                    <button class="favorite-btn added" onclick="toggleFavorite(${car.id})">
                        <i class="fas fa-heart"></i> Remove from Favorites
                    </button>
                    <button class="comment-btn">Add Comment</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateUsersList() {
    const usersList = document.getElementById('usersList');
    const users = JSON.parse(localStorage.getItem('users'));
    const searchTerm = searchUsersInput.value.toLowerCase();

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );

    usersList.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td class="${user.status === 'banned' ? 'banned' : ''}">${user.status}</td>
            <td>
                <button onclick="toggleUserStatus('${user.username}')">
                    ${user.status === 'active' ? 'Ban' : 'Unban'}
                </button>
            </td>
        </tr>
    `).join('');
}

function toggleUserStatus(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        users[userIndex].status = users[userIndex].status === 'active' ? 'banned' : 'active';
        localStorage.setItem('users', JSON.stringify(users));
        updateUsersList();
    }
}

// Comment functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('comment-btn')) {
        const carCard = e.target.closest('.car-card');
        const carId = carCard.dataset.carId;
        document.getElementById('carId').value = carId;
        commentModal.style.display = 'block';
        setTimeout(() => {
            commentModal.classList.add('show');
        }, 10);
        displayComments(carId);
    }
});

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const carId = document.getElementById('carId').value;
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    
    const comments = JSON.parse(localStorage.getItem('comments')) || {};
    if (!comments[carId]) {
        comments[carId] = [];
    }
    
    comments[carId].push({
        name,
        comment,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('comments', JSON.stringify(comments));
    displayComments(carId);
    commentForm.reset();
});

function displayComments(carId) {
    const comments = JSON.parse(localStorage.getItem('comments')) || {};
    const carComments = comments[carId] || [];
    
    commentsContainer.innerHTML = carComments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span>${comment.name}</span>
                <span>${new Date(comment.date).toLocaleDateString()}</span>
            </div>
            <div class="comment-text">${comment.comment}</div>
        </div>
    `).join('');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') return; // Skip for admin login
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA Button functionality
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        // Scroll to cars section
        const carsSection = document.getElementById('cars');
        if (carsSection) {
            carsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Contact Form functionality
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        
        // In a real application, you would send this data to a server
        // For now, we'll just show a success message
        alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
        
        // Reset the form
        contactForm.reset();
    });
}

// Add scroll-based header transparency
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.backgroundColor = '#ffffff';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    } else {
        // Scrolling up
        header.style.backgroundColor = '#ffffff';
    }
    
    lastScroll = currentScroll;
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Admin credentials (in a real app, this would be handled server-side)
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    // Initialize comments from localStorage or empty array
    let comments = JSON.parse(localStorage.getItem('carComments')) || [];
    let isAdminLoggedIn = false;

    // Get modal elements
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginBtn = document.getElementById('adminLoginBtn');

    // Admin login button click
    adminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adminLoginModal.style.display = 'block';
    });

    // Handle admin login
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            isAdminLoggedIn = true;
            document.body.classList.add('admin-logged-in');
            adminLoginBtn.textContent = 'Admin Logout';
            adminLoginModal.style.display = 'none';
            adminLoginForm.reset();
            alert('Successfully logged in as admin!');
        } else {
            alert('Invalid credentials!');
        }
    });

    // Admin logout
    adminLoginBtn.addEventListener('click', (e) => {
        if (isAdminLoggedIn) {
            e.preventDefault();
            isAdminLoggedIn = false;
            document.body.classList.remove('admin-logged-in');
            adminLoginBtn.textContent = 'Admin Login';
            alert('Logged out successfully!');
        }
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            commentModal.style.display = 'none';
            adminLoginModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === commentModal) {
            commentModal.style.display = 'none';
        }
        if (e.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
        }
    });

    // Add delete functionality for admin
    if (isAdminLoggedIn) {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = e.target.dataset.id;
                deleteComment(commentId);
            });
        });
    }

    // Delete comment
    function deleteComment(commentId) {
        if (confirm('Are you sure you want to delete this comment?')) {
            comments = comments.filter(comment => comment.id !== commentId);
            localStorage.setItem('carComments', JSON.stringify(comments));
            displayComments(carIdInput.value);
        }
    }
}); 